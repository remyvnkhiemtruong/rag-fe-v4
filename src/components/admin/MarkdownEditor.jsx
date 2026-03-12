import { useState } from 'react';
import { Eye, Code, Type, Bold, Italic, List, Link, Image as ImageIcon, Hash, CheckSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkdownEditor({ value, onChange, label, placeholder }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('edit');

  const insertMarkdown = (before, after = '') => {
    const textarea = document.getElementById('markdown-textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = value || '';
    const selectedText = text.substring(start, end) || t('admin.markdownDefaultSelection');

    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
    onChange({ target: { value: newText } });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const markdownButtons = [
    {
      icon: Hash,
      action: () => insertMarkdown('## '),
      tooltip: t('admin.markdownHeadingTooltip'),
    },
    {
      icon: Bold,
      action: () => insertMarkdown('**', '**'),
      tooltip: t('admin.markdownBoldTooltip'),
    },
    {
      icon: Italic,
      action: () => insertMarkdown('*', '*'),
      tooltip: t('admin.markdownItalicTooltip'),
    },
    {
      icon: List,
      action: () => insertMarkdown('\n- '),
      tooltip: t('admin.markdownListTooltip'),
    },
    {
      icon: CheckSquare,
      action: () => insertMarkdown('\n- [ ] '),
      tooltip: t('admin.markdownChecklistTooltip'),
    },
    {
      icon: Link,
      action: () => insertMarkdown('[', '](url)'),
      tooltip: t('admin.markdownLinkTooltip'),
    },
    {
      icon: ImageIcon,
      action: () => insertMarkdown('![alt](', ')'),
      tooltip: t('admin.markdownImageTooltip'),
    },
    {
      icon: Code,
      action: () => insertMarkdown('`', '`'),
      tooltip: t('admin.markdownCodeTooltip'),
    },
  ];

  const editorPlaceholder = placeholder || t('admin.markdownPlaceholder');

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      <div className="border border-gray-300 dark:border-gray-600 rounded-t-lg bg-gray-50 dark:bg-gray-700">
        <div className="flex items-center justify-between p-2 border-b border-gray-300 dark:border-gray-600">
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                activeTab === 'edit'
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Type className="w-4 h-4 inline mr-1" />
              {t('admin.markdownTabEdit')}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                activeTab === 'preview'
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <Eye className="w-4 h-4 inline mr-1" />
              {t('admin.markdownTabPreview')}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('split')}
              className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                activeTab === 'split'
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {t('admin.markdownTabSplit')}
            </button>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400">
            {t('admin.markdownCharCount', { count: value?.length || 0 })}
          </div>
        </div>

        {(activeTab === 'edit' || activeTab === 'split') && (
          <div className="flex flex-wrap gap-1 p-2">
            {markdownButtons.map((btn, idx) => (
              <button
                key={idx}
                type="button"
                onClick={btn.action}
                title={btn.tooltip}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors group relative"
              >
                <btn.icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {btn.tooltip}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="border border-t-0 border-gray-300 dark:border-gray-600 rounded-b-lg bg-white dark:bg-gray-800 min-h-[400px]">
        {activeTab === 'edit' && (
          <textarea
            id="markdown-textarea"
            value={value || ''}
            onChange={onChange}
            placeholder={editorPlaceholder}
            className="w-full h-[400px] p-4 bg-transparent border-0 focus:ring-0 focus:outline-none resize-none font-mono text-sm dark:text-gray-200"
          />
        )}

        {activeTab === 'preview' && (
          <div className="p-4 prose dark:prose-invert max-w-none">
            {value ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {value}
              </ReactMarkdown>
            ) : (
              <p className="text-gray-400 italic">{t('admin.markdownPreviewEmpty')}</p>
            )}
          </div>
        )}

        {activeTab === 'split' && (
          <div className="grid grid-cols-2 divide-x divide-gray-300 dark:divide-gray-600">
            <div>
              <textarea
                id="markdown-textarea"
                value={value || ''}
                onChange={onChange}
                placeholder={placeholder || t('admin.markdownPlaceholderShort')}
                className="w-full h-[400px] p-4 bg-transparent border-0 focus:ring-0 focus:outline-none resize-none font-mono text-sm dark:text-gray-200"
              />
            </div>
            <div className="p-4 prose dark:prose-invert max-w-none overflow-y-auto h-[400px]">
              {value ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {value}
                </ReactMarkdown>
              ) : (
                <p className="text-gray-400 italic">{t('admin.markdownSplitPreviewEmpty')}</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
        <p className="font-medium">{t('admin.markdownQuickGuide')}</p>
        <div className="grid grid-cols-2 gap-2 mt-1">
          <div><code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">{t('admin.markdownGuideHeading2Code')}</code> - {t('admin.markdownGuideHeading2')}</div>
          <div><code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">{t('admin.markdownGuideHeading3Code')}</code> - {t('admin.markdownGuideHeading3')}</div>
          <div><code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">{t('admin.markdownGuideBoldCode')}</code> - {t('admin.markdownGuideBold')}</div>
          <div><code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">{t('admin.markdownGuideItalicCode')}</code> - {t('admin.markdownGuideItalic')}</div>
          <div><code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">{t('admin.markdownGuideListCode')}</code> - {t('admin.markdownGuideList')}</div>
          <div><code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">{t('admin.markdownGuideLinkCode')}</code> - {t('admin.markdownGuideLink')}</div>
        </div>
      </div>
    </div>
  );
}
