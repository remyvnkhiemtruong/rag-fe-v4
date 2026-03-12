import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CHAT_FAKE_ANSWERS,
  CHAT_FALLBACK_MESSAGES,
  CHAT_WELCOME_MESSAGES,
} from '../data/chatPrompts';
import { normalizeLanguageCode } from '../utils/i18nField';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getByLanguage = (map, languageCode) => map[languageCode] || map.vi;

export function useStreamingChat() {
  const { i18n } = useTranslation();
  const getLanguageCode = () => normalizeLanguageCode(i18n.resolvedLanguage || i18n.language);

  const [messages, setMessages] = useState(() => {
    const languageCode = getLanguageCode();
    return [
      {
        role: 'assistant',
        content: getByLanguage(CHAT_WELCOME_MESSAGES, languageCode),
      },
    ];
  });

  const [isStreaming, setIsStreaming] = useState(false);

  const sendMessage = async (userInput) => {
    const languageCode = getLanguageCode();
    const localizedAnswers = getByLanguage(CHAT_FAKE_ANSWERS, languageCode);

    setMessages((prev) => [...prev, { role: 'user', content: userInput }]);
    setIsStreaming(true);

    await sleep(1200);

    const fullAnswer = localizedAnswers[userInput] || getByLanguage(CHAT_FALLBACK_MESSAGES, languageCode);
    const words = fullAnswer.split(' ');
    let currentText = '';

    for (let i = 0; i < words.length; i += 1) {
      await sleep(35);
      currentText += `${words[i]} `;

      setMessages((prev) => {
        const updated = [...prev];
        const lastMessage = updated[updated.length - 1];

        if (lastMessage?.role === 'assistant' && lastMessage.isTemp) {
          lastMessage.content = currentText;
        } else {
          updated.push({
            role: 'assistant',
            content: currentText,
            isTemp: true,
          });
        }

        return updated;
      });
    }

    setMessages((prev) => prev.map((message) => (
      message.isTemp
        ? { role: 'assistant', content: message.content }
        : message
    )));

    setIsStreaming(false);
  };

  return {
    messages,
    isStreaming,
    sendMessage,
  };
}
