import { useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CHAT_ERROR_MESSAGES, CHAT_WELCOME_MESSAGES } from '../data/chatPrompts';
import { normalizeLanguageCode } from '../utils/i18nField';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const generateUserId = () => {
  const stored = localStorage.getItem('dify_user_id');
  if (stored) return stored;
  const newId = `user-${Math.random().toString(36).substring(2, 15)}`;
  localStorage.setItem('dify_user_id', newId);
  return newId;
};

const getByLanguage = (map, languageCode) => map[languageCode] || map.vi;

export function useStreamingChat() {
  const { i18n } = useTranslation();
  const languageCode = normalizeLanguageCode(i18n.resolvedLanguage || i18n.language);
  const getWelcomeMessage = useCallback(
    () => getByLanguage(CHAT_WELCOME_MESSAGES, languageCode),
    [languageCode]
  );

  const [messages, setMessages] = useState(() => [
    {
      role: 'assistant',
      content: getByLanguage(CHAT_WELCOME_MESSAGES, languageCode),
      metadata: null,
    },
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);

  const conversationIdRef = useRef(null);
  const userIdRef = useRef(generateUserId());

  const streamFromBackend = useCallback(async (userMessage) => {
    setIsStreaming(true);
    setError(null);

    setMessages((prev) => [
      ...prev,
      { role: 'assistant', content: '', metadata: null },
    ]);

    try {
      const requestBody = {
        inputs: {},
        query: userMessage,
        response_mode: 'streaming',
        user: userIdRef.current,
      };

      if (conversationIdRef.current) {
        requestBody.conversation_id = conversationIdRef.current;
      }

      const response = await fetch(`${API_BASE_URL}/chat-messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';
      let messageMetadata = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.trim()) continue;

          if (line.startsWith('data: ')) {
            const data = line.slice(6);

            try {
              const parsed = JSON.parse(data);

              if (parsed.event === 'message') {
                if (parsed.conversation_id) {
                  conversationIdRef.current = parsed.conversation_id;
                }

                if (parsed.answer) {
                  fullResponse += parsed.answer;

                  setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                      role: 'assistant',
                      content: fullResponse,
                      metadata: messageMetadata,
                    };
                    return updated;
                  });
                }
              } else if (parsed.event === 'message_end') {
                if (parsed.conversation_id) {
                  conversationIdRef.current = parsed.conversation_id;
                }

                if (parsed.metadata) {
                  messageMetadata = parsed.metadata;

                  setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                      role: 'assistant',
                      content: fullResponse,
                      metadata: messageMetadata,
                    };
                    return updated;
                  });
                }
              } else if (parsed.event === 'error') {
                throw new Error(parsed.message || 'API Error');
              }
            } catch (parseError) {
              if (parseError.message === 'API Error') {
                throw parseError;
              }
            }
          }
        }
      }
    } catch (err) {
      setError(err.message);
      const errorMessage = getByLanguage(CHAT_ERROR_MESSAGES, languageCode);

      setMessages((prev) => {
        const updated = [...prev];
        if (updated.length > 0 && updated[updated.length - 1].role === 'assistant') {
          updated[updated.length - 1] = {
            role: 'assistant',
            content: errorMessage,
            metadata: null,
          };
        } else {
          updated.push({
            role: 'assistant',
            content: errorMessage,
            metadata: null,
          });
        }
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  }, [languageCode]);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      role: 'user',
      content: text,
      metadata: null,
    };

    setMessages((prev) => [...prev, userMessage]);
    await streamFromBackend(text);
  }, [streamFromBackend]);

  const clearMessages = useCallback(() => {
    setMessages([
      {
        role: 'assistant',
        content: getWelcomeMessage(),
        metadata: null,
      },
    ]);
    conversationIdRef.current = null;
    setError(null);
  }, [getWelcomeMessage]);

  return { messages, isStreaming, sendMessage, error, clearMessages };
}
