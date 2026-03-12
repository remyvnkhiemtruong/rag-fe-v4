import React, { useState } from 'react';
import { Share2, Facebook, Twitter, Link2, Check, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function SocialShare({
  url = typeof window !== 'undefined' ? window.location.href : '',
  title,
  description: _description = '',
  compact = false
}) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareTitle = title || t('common.appName');

  const shareLinks = [
    {
      name: t('common.facebook'),
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      name: t('common.twitter'),
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareTitle)}`,
      color: 'bg-sky-500 hover:bg-sky-600',
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Failed to copy URL to clipboard
    }
  };

  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label={t('common.share')}
        >
          <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute right-0 top-full mt-2 z-50 glass-card p-4 min-w-[200px]"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('common.share')}
                  </span>
                  <button onClick={() => setIsOpen(false)}>
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                
                <div className="flex gap-2 mb-3">
                  {shareLinks.map(link => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 rounded-lg text-white ${link.color} transition-colors`}
                      title={link.name}
                    >
                      <link.icon className="w-5 h-5" />
                    </a>
                  ))}
                  <button
                    onClick={copyToClipboard}
                    className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    title={t('common.copyLink')}
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <Link2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    )}
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {shareLinks.map(link => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium ${link.color} transition-colors`}
        >
          <link.icon className="w-4 h-4" />
          {link.name}
        </a>
      ))}
      <button
        onClick={copyToClipboard}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-green-600" />
            {t('common.copied')}
          </>
        ) : (
          <>
            <Link2 className="w-4 h-4" />
            {t('common.copy')}
          </>
        )}
      </button>
    </div>
  );
}

