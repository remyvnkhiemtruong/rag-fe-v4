import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Award, ArrowRight } from 'lucide-react';
import { formatHeritageLocation } from '../../utils/formatLocation';

const rankingColors = {
  'Quốc gia đặc biệt': 'bg-heritage-red-600',
  'Quốc gia': 'bg-heritage-gold-500',
  'Cấp tỉnh': 'bg-green-500',
  'Không': 'bg-gray-500',
};

function TimelineItem({ heritage, index, isLeft, t }) {
  // Use yearBuilt or yearRanked
  const year = heritage.yearBuilt || heritage.yearRanked || null;

  // Translate ranking type
  const getRankingLabel = (rankingType) => {
    switch (rankingType) {
      case 'Quốc gia đặc biệt':
        return t('timeline.nationalSpecial');
      case 'Quốc gia':
        return t('timeline.national');
      case 'Cấp tỉnh':
        return t('timeline.provincial');
      default:
        return rankingType;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={`relative flex items-center ${isLeft ? 'md:flex-row-reverse' : ''} mb-8 md:mb-0`}
    >
      {/* Content Card */}
      <div className={`w-full md:w-5/12 ${isLeft ? 'md:text-right' : ''}`}>
        <div className="glass-card p-6 hover:shadow-xl transition-all duration-300 group">
          {/* Year Badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold mb-3 ${rankingColors[heritage.rankingType] || 'bg-gray-500'} text-white`}>
            <Calendar className="w-4 h-4" />
            {year || 'N/A'}
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-heritage-red-600 dark:group-hover:text-heritage-gold-400 transition-colors">
            {heritage.name}
          </h3>

          {/* Location */}
          {heritage.commune && (
            <div className={`flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-3 ${isLeft ? 'md:justify-end' : ''}`}>
              <MapPin className="w-4 h-4" />
              <span>{formatHeritageLocation(heritage, t)}</span>
            </div>
          )}

          {/* Ranking */}
          {heritage.rankingType && heritage.rankingType !== 'Không' && (
            <div className={`flex items-center gap-2 text-sm mb-4 ${isLeft ? 'md:justify-end' : ''}`}>
              <Award className="w-4 h-4 text-heritage-gold-500" />
              <span className="text-gray-600 dark:text-gray-400">{getRankingLabel(heritage.rankingType)}</span>
            </div>
          )}

          {/* Link */}
          <Link
            to={`/heritage/${heritage.id}`}
            className={`inline-flex items-center gap-2 text-heritage-red-600 dark:text-heritage-gold-400 text-sm font-medium hover:gap-3 transition-all ${isLeft ? 'md:flex-row-reverse' : ''}`}
          >
            <span>{t('timeline.viewDetails')}</span>
            <ArrowRight className={`w-4 h-4 ${isLeft ? 'md:rotate-180' : ''}`} />
          </Link>
        </div>
      </div>

      {/* Timeline Dot */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center">
        <div className={`w-4 h-4 rounded-full border-4 border-white dark:border-gray-900 shadow-lg ${rankingColors[heritage.rankingType] || 'bg-gray-500'}`}></div>
      </div>

      {/* Spacer */}
      <div className="hidden md:block w-5/12"></div>
    </motion.div>
  );
}

export default function HeritageTimeline({ heritages = [] }) {
  const { t } = useTranslation();

  // Sort by year (yearBuilt or yearRanked)
  const sortedHeritages = [...heritages].sort((a, b) => {
    const yearA = parseInt(a.yearBuilt) || parseInt(a.yearRanked) || 0;
    const yearB = parseInt(b.yearBuilt) || parseInt(b.yearRanked) || 0;
    return yearB - yearA;
  });

  return (
    <div className="relative py-8">
      {/* Timeline Line */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-heritage-red-500 via-heritage-gold-500 to-green-500"></div>

      {/* Timeline Items */}
      <div className="space-y-8 md:space-y-16">
        {sortedHeritages.map((heritage, index) => (
          <TimelineItem
            key={heritage.id}
            heritage={heritage}
            index={index}
            isLeft={index % 2 === 0}
            t={t}
          />
        ))}
      </div>
    </div>
  );
}

