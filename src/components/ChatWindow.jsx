import { useStreamingChat } from "../hooks/streamingChat";
import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from 'react-i18next';
import { Send, Loader2, MessageSquare, Sparkles, Landmark, ArrowDown } from 'lucide-react';
import { MessageBubble } from "./MessageBubble";
import { SuggestedQuestions } from "./SuggestedQuestions";


export function ChatWindow() {
  const { t } = useTranslation();
  const { messages, isStreaming, sendMessage } = useStreamingChat();
  const [input, setInput] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [userScrolled, setUserScrolled] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Scroll to bottom function - scrolls only within the container, not the whole page
  const scrollToBottom = useCallback((behavior = 'smooth') => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: behavior
      });
    }
  }, []);

  // Check if user is near bottom
  const isNearBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return true;
    const threshold = 100; // pixels from bottom
    return container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
  }, []);

  // Handle scroll events to detect manual scrolling
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const nearBottom = isNearBottom();
    setShowScrollButton(!nearBottom);

    // If user scrolls up while streaming, mark as user scrolled
    if (isStreaming && !nearBottom) {
      setUserScrolled(true);
    }

    // If user scrolls back to bottom, reset
    if (nearBottom) {
      setUserScrolled(false);
    }
  }, [isStreaming, isNearBottom]);

  // Auto-scroll when new messages arrive or during streaming
  useEffect(() => {
    // Don't auto-scroll if user manually scrolled up
    if (userScrolled) return;

    // Always scroll for new messages
    scrollToBottom();
  }, [messages, scrollToBottom, userScrolled]);

  // Auto-scroll during streaming (for real-time updates)
  useEffect(() => {
    if (!isStreaming) {
      // Reset user scrolled when streaming ends
      setUserScrolled(false);
      return;
    }

    // Set up interval to scroll during streaming if user hasn't scrolled
    const scrollInterval = setInterval(() => {
      if (!userScrolled && isNearBottom()) {
        scrollToBottom('auto');
      }
    }, 100);

    return () => clearInterval(scrollInterval);
  }, [isStreaming, userScrolled, scrollToBottom, isNearBottom]);

  // Scroll to bottom when streaming starts
  useEffect(() => {
    if (isStreaming && !userScrolled) {
      scrollToBottom();
    }
  }, [isStreaming, userScrolled, scrollToBottom]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isStreaming) {
      setUserScrolled(false); // Reset scroll state on new message
      sendMessage(input);
      setInput('');
      // Immediate scroll for new user message
      setTimeout(() => scrollToBottom(), 50);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSuggestedQuestion = (question) => {
    if (!isStreaming) {
      setUserScrolled(false);
      sendMessage(question);
      setTimeout(() => scrollToBottom(), 50);
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full min-h-[calc(100vh-8rem)] px-0 overflow-hidden">
      {/* Chat Container - gần full màn hình, dùng hết bề ngang container */}
      <div className="flex-1 flex flex-col min-h-[280px] bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Decorative top border */}
        <div className="h-1 bg-gradient-to-r from-heritage-red-700 via-heritage-gold-500 to-heritage-red-700" />

        {/* Chat Header */}
        <div className="relative bg-gradient-to-r from-heritage-red-800 via-heritage-red-700 to-heritage-red-800 text-white px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex-shrink-0">
          {/* Gold accent line at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-heritage-gold-400 via-heritage-gold-300 to-heritage-gold-400" />

          <div className="relative z-10 flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-heritage-gold-500 flex items-center justify-center shadow-md flex-shrink-0">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-heritage-red-800" />
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-base sm:text-lg text-white truncate">
                {t('chat.title')}
              </h2>
              <p className="text-xs sm:text-sm text-heritage-gold-300 flex items-center gap-1.5 truncate">
                <Sparkles className="w-3 h-3" />
                <span>{t('chat.subtitle')}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 bg-gray-50 dark:bg-gray-800 scrollbar-heritage relative min-h-0"
        >
          {messages.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <div className="relative inline-block mb-4 sm:mb-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-heritage-gold-100 dark:bg-heritage-gold-900/30 flex items-center justify-center border-2 border-heritage-gold-300 dark:border-heritage-gold-600">
                  <Landmark className="w-7 h-7 sm:w-8 sm:h-8 text-heritage-red-700 dark:text-heritage-red-400" />
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 px-2">
                {t('chat.welcome')}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto px-2">
                {t('chat.welcomeDesc')}
              </p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <MessageBubble
              key={idx}
              message={msg}
              isStreaming={isStreaming && idx === messages.length - 1 && msg.role === 'assistant'}
            />
          ))}

          {/* Invisible element at the end for reference */}
          <div ref={messagesEndRef} className="h-0" />

          {/* Scroll to bottom button - positioned relative to container */}
          {showScrollButton && (
            <button
              onClick={() => {
                setUserScrolled(false);
                scrollToBottom();
              }}
              className="sticky bottom-3 right-3 sm:bottom-4 sm:right-4 p-2.5 sm:p-3 bg-heritage-red-700 text-white rounded-full shadow-lg hover:bg-heritage-red-800 transition-all animate-fade-in z-10"
              aria-label={t('chat.scrollToBottom')}
            >
              <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 sm:p-4 flex-shrink-0">
          {/* Suggested Questions */}
          <SuggestedQuestions
            onQuestionClick={handleSuggestedQuestion}
            disabled={isStreaming}
          />

          {/* Input Form */}
          <div className="flex gap-2 sm:gap-3">
            <div className="flex-1 min-w-0 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('chat.placeholder')}
                disabled={isStreaming}
                className="w-full min-w-0 px-3 sm:px-4 py-2.5 sm:py-3 pr-10 sm:pr-12 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:outline-none focus:border-heritage-gold-500 focus:ring-2 focus:ring-heritage-gold-200 dark:focus:ring-heritage-gold-800 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500 transition-all"
              />
              {input.length > 0 && (
                <span className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                  {t('chat.charCount', { count: input.length })}
                </span>
              )}
            </div>
            <button
              onClick={handleSubmit}
              disabled={isStreaming || !input.trim()}
              className="bg-gradient-to-r from-heritage-red-700 to-heritage-red-800 text-white p-2.5 sm:p-3 rounded-lg sm:rounded-xl hover:from-heritage-red-800 hover:to-heritage-red-900 transition-all disabled:from-gray-300 disabled:to-gray-400 dark:disabled:from-gray-600 dark:disabled:to-gray-700 disabled:cursor-not-allowed shadow-md disabled:shadow-none flex items-center justify-center min-w-[44px] sm:min-w-[48px] flex-shrink-0"
            >
              {isStreaming ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Typing indicator */}
          {isStreaming && (
            <div className="flex items-center gap-2 mt-2 sm:mt-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-heritage-gold-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-heritage-gold-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-heritage-gold-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span>{t('chat.typing')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
