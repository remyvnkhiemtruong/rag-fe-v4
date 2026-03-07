import { Sparkles } from 'lucide-react';

export function SuggestedQuestions({ onQuestionClick, disabled }) {
  const questions = [
    'Di tích lịch sử Nọc Nạng là gì?',
    'Sự kiện Nọc Nạng năm 1928 có ý nghĩa như thế nào?',
    'Ông Mười Chức là ai?',
    'Lễ hội Dấu ấn Đồng Nọc Nạng được tổ chức khi nào?'
  ];

  return (
    <div className="mb-3 sm:mb-4">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-2 sm:mb-3">
        <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-heritage-gold-600 dark:text-heritage-gold-400 flex-shrink-0" />
        <span className="text-[10px] sm:text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide truncate">
          Câu hỏi gợi ý
        </span>
        <div className="flex-1 min-w-0 h-px bg-gradient-to-r from-heritage-gold-400 dark:from-heritage-gold-600 to-transparent" />
      </div>

      {/* Questions - wrap nicely on all screens, touch-friendly on mobile */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {questions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => onQuestionClick(q)}
            disabled={disabled}
            type="button"
            className={`
              text-left text-xs sm:text-sm px-3 sm:px-4 py-2.5 sm:py-2.5 rounded-lg font-semibold min-h-[44px]
              transition-all duration-200
              border-2 border-heritage-gold-300 dark:border-gray-600
              bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
              hover:border-heritage-gold-500 dark:hover:border-heritage-gold-500 hover:bg-heritage-gold-50 dark:hover:bg-gray-600
              hover:shadow-md
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-heritage-gold-300 dark:disabled:hover:border-gray-600 disabled:hover:bg-white dark:disabled:hover:bg-gray-700 disabled:hover:shadow-none
              group
            `}
          >
            <span className="flex items-center gap-2 flex-wrap">
              <span className="w-5 h-5 rounded-full bg-heritage-gold-100 dark:bg-gray-600 border border-heritage-gold-400 dark:border-gray-500 flex items-center justify-center text-heritage-gold-700 dark:text-heritage-gold-400 font-bold text-xs flex-shrink-0 group-hover:bg-heritage-gold-200 dark:group-hover:bg-heritage-gold-900/30 group-hover:border-heritage-gold-500 dark:group-hover:border-heritage-gold-500 transition-colors">
                {idx + 1}
              </span>
              <span className="text-gray-800 dark:text-gray-100 break-words">{q}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
