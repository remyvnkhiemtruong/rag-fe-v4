import { useTranslation } from 'react-i18next';
import { MapPin, Calendar, Landmark, Award, Star, ChevronRight } from 'lucide-react';
import { getRankingStyle, normalizeRankingCode, RANKING_CODES } from '../../utils/ranking';
import { hasRecognizedYear } from '../utils/heritageDisplay';

export function HeritageListItem({ item, onClick }) {
  const { t } = useTranslation();
  const code = normalizeRankingCode(item.rankingType);
  const style = getRankingStyle(item.rankingType);
  const rankingLabel = code ? t(`ranking.${code}`) : (item.rankingType || '');
  const IconComponent = code === RANKING_CODES.NATIONAL_SPECIAL ? Star : code === RANKING_CODES.NATIONAL ? Award : Landmark;

  return (
    <div
      onClick={() => onClick(item)}
      className="group bg-white rounded-xl border border-heritage-earth-200 shadow-elegant hover:shadow-elegant-lg transition-all duration-300 cursor-pointer overflow-hidden hover-lift flex"
    >
      {/* Left accent bar */}
      <div className={`w-1.5 ${style.accent} flex-shrink-0`} />

      {/* Image Container */}
      <div className="relative w-36 h-36 flex-shrink-0 overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="bg-gradient-to-br from-heritage-cream-100 via-heritage-cream-200 to-heritage-gold-100 h-full flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-heritage-cream-50 flex items-center justify-center shadow-elegant border-2 border-heritage-gold-400">
              <Landmark className="w-6 h-6 text-heritage-red-700" />
            </div>
          </div>
        )}

        {/* Year Built overlay */}
        {hasRecognizedYear(item.yearBuilt) && (
          <div className="absolute bottom-2 left-2 bg-heritage-earth-900/80 backdrop-blur-sm text-white px-2 py-0.5 rounded text-xs flex items-center gap-1">
            <Calendar className="w-3 h-3 text-heritage-gold-400" />
            <span>{item.yearBuilt}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 min-w-0 flex flex-col justify-between">
        <div>
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-display font-bold text-lg text-heritage-earth-900 group-hover:text-heritage-red-700 transition-colors line-clamp-1">
              {item.name}
            </h3>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 flex-shrink-0 ${style.badge}`}>
              <IconComponent className="w-3 h-3" />
              <span className="hidden sm:inline">{rankingLabel}</span>
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-heritage-earth-600 mb-2">
            <MapPin className="w-4 h-4 flex-shrink-0 text-heritage-red-600" />
            <span className="truncate">{item.address}</span>
          </div>

          {/* Notes */}
          {item.notes && (
            <p className="text-sm text-heritage-earth-500 line-clamp-1 italic">
              "{item.notes}"
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-heritage-earth-100">
          {item.yearRanked ? (
            <div className="flex items-center gap-1.5 text-xs text-heritage-earth-500">
              <Award className="w-3.5 h-3.5 text-heritage-gold-500" />
              <span>{t('detail.yearRanked')} {item.yearRanked}</span>
            </div>
          ) : (
            <div />
          )}

          {/* View more indicator */}
          <div className="flex items-center gap-1 text-xs font-medium text-heritage-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
            <span>{t('common.viewDetails')}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Decorative corner ornament */}
      <div className="absolute bottom-0 right-0 w-12 h-12 overflow-hidden opacity-5 pointer-events-none">
        <div className="absolute -bottom-6 -right-6 w-12 h-12 border-4 border-heritage-gold-500 rounded-full" />
      </div>
    </div>
  );
}
