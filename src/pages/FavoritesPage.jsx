import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Heart, Trash2, MapPin, Award, ArrowRight } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import heritages from '../data/heritages.json';
import EmptyState from '../components/ui/EmptyState';
import { getRankingStyle, normalizeRankingCode } from '../utils/ranking';
import { formatHeritageLocation } from '../utils/formatLocation';

function FavoriteCard({ heritage, onRemove }) {
  const { t } = useTranslation();
  const raw = heritage.ranking || heritage.rankingType;
  const style = getRankingStyle(raw);
  const code = normalizeRankingCode(raw);
  const rankingLabel = code ? t(`ranking.${code}`) : (raw || '');
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="glass-card overflow-hidden group"
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-heritage-red-600 to-heritage-gold-500">
        {heritage.image && (
          <img
            src={heritage.image}
            alt={heritage.name}
            className="w-full h-full object-cover opacity-80"
          />
        )}
        
        {/* Remove Button */}
        <button
          onClick={() => onRemove(heritage.id)}
          className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-red-500 hover:text-white rounded-full transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        
        {/* Ranking Badge */}
        <div className={`absolute bottom-3 left-3 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${style.badgeCompact || 'bg-gray-600 text-white'}`}>
          <Award className="w-3 h-3" />
          {rankingLabel}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-heritage-red-600 dark:group-hover:text-heritage-gold-400 transition-colors">
          {heritage.name}
        </h3>
        
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-4">
          <MapPin className="w-4 h-4" />
          <span>{formatHeritageLocation(heritage, t)}</span>
        </div>
        
        <Link
          to={`/heritage/${heritage.id}`}
          className="inline-flex items-center gap-2 text-heritage-red-600 dark:text-heritage-gold-400 text-sm font-medium hover:gap-3 transition-all"
        >
          {t('common.viewDetails')}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
}

export default function FavoritesPage() {
  const { t } = useTranslation();
  const { favorites, removeFavorite, clearFavorites } = useFavorites();
  
  const favoriteHeritages = heritages.filter(h => favorites.includes(h.id));

  return (
    <div className="min-h-screen bg-heritage-cream-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Heart className="w-8 h-8 text-heritage-red-600 fill-heritage-red-600" />
                {t('favoritesPage.title')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {t('favoritesPage.countSaved', { count: favoriteHeritages.length })}
              </p>
            </div>
            
            {favoriteHeritages.length > 0 && (
              <button
                onClick={clearFavorites}
                className="inline-flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                {t('favoritesPage.clearAll')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {favoriteHeritages.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {favoriteHeritages.map(heritage => (
              <FavoriteCard
                key={heritage.id}
                heritage={heritage}
                onRemove={removeFavorite}
              />
            ))}
          </motion.div>
        ) : (
          <EmptyState
            type="favorites"
            title={t('favoritesPage.emptyTitle')}
            description={t('favoritesPage.emptyDesc')}
            action={{
              label: t('favoritesPage.exploreLabel'),
              onClick: () => window.location.href = '/heritage'
            }}
          />
        )}
      </div>
    </div>
  );
}

