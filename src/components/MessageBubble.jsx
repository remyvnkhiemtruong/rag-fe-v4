import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTranslation } from 'react-i18next';
import { User, Landmark } from 'lucide-react';

export function MessageBubble({ message, isStreaming = false }) {
  const { t } = useTranslation();
  const isUser = message.role === 'user';

  const sources =
    message.metadata?.retriever_resources ||
    message.metadata?.retrieval_resources ||
    [];
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {/* Avatar for assistant */}
      {!isUser && (
        <div className="flex-shrink-0 mr-3">
          <div className="w-10 h-10 rounded-full bg-heritage-red-700 dark:bg-heritage-red-800 flex items-center justify-center shadow-heritage border-2 border-heritage-gold-400 dark:border-heritage-gold-500">
            <Landmark className="w-5 h-5 text-heritage-gold-300" />
          </div>
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={`max-w-[80%] rounded-2xl px-5 py-3.5 shadow-elegant ${isUser
          ? 'bg-gradient-to-r from-heritage-red-700 to-heritage-red-800 text-white rounded-br-md border border-heritage-red-600'
          : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-md border border-gray-200 dark:border-gray-600'
          }`}
      >
        {/* Message Content with Markdown */}
        <div
          className={`text-sm leading-relaxed text-start prose prose-sm max-w-none ${isUser
            ? 'prose-invert prose-p:text-white prose-headings:text-white prose-strong:text-white prose-a:text-heritage-gold-300'
            : 'prose-p:text-gray-800 dark:prose-p:text-gray-100 prose-headings:text-gray-900 dark:prose-headings:text-gray-50 prose-strong:text-gray-900 dark:prose-strong:text-gray-50 prose-a:text-heritage-red-700 dark:prose-a:text-heritage-gold-400'
            }`}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Paragraphs
              p: ({ children }) => <p className="mb-2 last:mb-0 text-gray-800 dark:text-gray-100">{children}</p>,

              // Headings
              h1: ({ children }) => (
                <h1 className="text-lg font-display font-bold mb-2 mt-3 first:mt-0 text-gray-900 dark:text-gray-50">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-base font-display font-bold mb-2 mt-3 first:mt-0 text-gray-900 dark:text-gray-50">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-sm font-display font-bold mb-1 mt-2 first:mt-0 text-gray-900 dark:text-gray-50">{children}</h3>
              ),

              // Lists
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-2 space-y-1 text-gray-800 dark:text-gray-100">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-2 space-y-1 text-gray-800 dark:text-gray-100">{children}</ol>
              ),
              li: ({ children }) => <li className="ml-2 text-gray-800 dark:text-gray-100">{children}</li>,

              // Links
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`underline hover:no-underline font-medium ${isUser
                    ? 'text-heritage-gold-300 hover:text-heritage-gold-200'
                    : 'text-heritage-red-700 dark:text-heritage-gold-400 hover:text-heritage-red-800 dark:hover:text-heritage-gold-300'
                    }`}
                >
                  {children}
                </a>
              ),

              // Code
              code: ({ inline, children }) =>
                inline ? (
                  <code
                    className={`px-1.5 py-0.5 rounded text-xs font-mono ${isUser
                      ? 'bg-heritage-red-600 text-heritage-gold-200'
                      : 'bg-heritage-earth-100 dark:bg-gray-600 text-heritage-red-700 dark:text-heritage-gold-300 border border-heritage-earth-200 dark:border-gray-500'
                      }`}
                  >
                    {children}
                  </code>
                ) : (
                  <pre
                    className={`p-3 rounded-lg text-xs font-mono overflow-x-auto my-2 ${isUser
                      ? 'bg-heritage-red-900/50 border border-heritage-red-600'
                      : 'bg-heritage-earth-50 dark:bg-gray-800 border border-heritage-earth-200 dark:border-gray-600'
                      }`}
                  >
                    <code>{children}</code>
                  </pre>
                ),

              // Blockquote
              blockquote: ({ children }) => (
                <blockquote
                  className={`border-l-4 pl-3 my-2 italic ${isUser
                    ? 'border-heritage-gold-400 text-heritage-gold-100'
                    : 'border-heritage-gold-500 dark:border-heritage-gold-600 text-heritage-earth-600 dark:text-gray-300 bg-heritage-gold-50/50 dark:bg-heritage-gold-900/20 py-1 rounded-r'
                    }`}
                >
                  {children}
                </blockquote>
              ),

              // Table
              table: ({ children }) => (
                <div className="overflow-x-auto my-2">
                  <table className="min-w-full text-xs border-collapse">{children}</table>
                </div>
              ),
              th: ({ children }) => (
                <th
                  className={`border px-2 py-1.5 font-semibold text-left ${isUser
                    ? 'border-heritage-red-500 bg-heritage-red-600'
                    : 'border-heritage-earth-300 dark:border-gray-600 bg-heritage-earth-100 dark:bg-gray-700'
                    }`}
                >
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td
                  className={`border px-2 py-1.5 ${isUser ? 'border-heritage-red-500' : 'border-heritage-earth-300 dark:border-gray-600'
                    }`}
                >
                  {children}
                </td>
              ),

              // Horizontal rule
              hr: () => (
                <hr
                  className={`my-3 ${isUser ? 'border-heritage-red-500' : 'border-heritage-earth-200 dark:border-gray-600'
                    }`}
                />
              ),

              // Text formatting
              strong: ({ children }) => <strong className="font-bold text-gray-900 dark:text-gray-50">{children}</strong>,
              em: ({ children }) => <em className="italic">{children}</em>,
            }}
          >
            {message.content}
          </ReactMarkdown>

          {/* Streaming cursor */}
          {isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-heritage-gold-500 animate-pulse rounded-sm" />
          )}
          {/* Sources / Citations */}
          {!isUser && sources.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
              <details className="group">
                <summary className="cursor-pointer text-xs font-semibold text-heritage-red-700 dark:text-heritage-gold-400 hover:underline">
                  Nguồn tham khảo ({sources.length})
                </summary>

                <ol className="mt-2 space-y-2 text-xs">
                  {sources.map((src, index) => (
                    <li
                      key={index}
                      className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600"
                    >
                      <p className="font-medium text-gray-700 dark:text-gray-200">
                        [{index + 1}] {src.document_name || "Tài liệu"}
                      </p>

                      <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
                        {src.content}
                      </p>

                      <p className="text-gray-400 mt-1">
                        {t('common.relevance')}: {(src.score * 100).toFixed(1)}%
                      </p>
                    </li>
                  ))}
                </ol>
              </details>
            </div>
          )}

        </div>
      </div>

      {/* Avatar for user */}
      {isUser && (
        <div className="flex-shrink-0 ml-3">
          <div className="w-10 h-10 rounded-full bg-heritage-earth-700 dark:bg-heritage-earth-800 flex items-center justify-center shadow-elegant border-2 border-heritage-earth-500 dark:border-heritage-earth-600">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      )}
    </div>
  );
}
