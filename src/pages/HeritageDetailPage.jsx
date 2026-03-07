import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, MapPin, Award, Calendar, Volume2, Video, 
  Heart, Share2, Printer, ExternalLink, ChevronRight
} from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import heritages from '../data/heritages.json';
import ReactMarkdown from 'react-markdown';
import { getRankingStyle, normalizeRankingCode } from '../utils/ranking';
import { formatHeritageLocation } from '../utils/formatLocation';
import { ADMIN_LEGAL_BASIS } from '../data/adminCrosswalk';

function SocialShareButtons({ heritage }) {
  const { t } = useTranslation();
  const shareUrl = window.location.href;
  const shareText = t('heritageDetail.shareText', { name: heritage.name });
  
  const shareLinks = [
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      name: 'Twitter',
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      color: 'bg-sky-500 hover:bg-sky-600',
    },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    alert(t('common.copied'));
  };

  return (
    <div className="flex items-center gap-2">
      {shareLinks.map(link => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`px-3 py-2 rounded-lg text-white text-sm font-medium ${link.color} transition-colors`}
        >
          {link.name}
        </a>
      ))}
      <button
        onClick={copyToClipboard}
        className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      >
        {t('common.copy')}
      </button>
    </div>
  );
}

function RelatedHeritages({ currentId, commune }) {
  const { t } = useTranslation();
  const related = heritages
    .filter(h => h.id !== currentId && h.commune === commune)
    .slice(0, 4);
  
  if (related.length === 0) return null;

  return (
    <div className="mt-12">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        {t('heritageDetail.heritageInArea')}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {related.map(heritage => (
          <Link
            key={heritage.id}
            to={`/heritage/${heritage.id}`}
            className="glass-card p-4 hover:shadow-lg transition-all group"
          >
            <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-heritage-red-600 dark:group-hover:text-heritage-gold-400 transition-colors line-clamp-2 mb-2">
              {heritage.name}
            </h4>
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <MapPin className="w-3 h-3" />
              {formatHeritageLocation(heritage, t)}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function HeritageDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  const heritage = heritages.find(h => h.id === parseInt(id) || h.id === id);
  
  if (!heritage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-heritage-cream-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('heritageDetail.notFound')}
          </h2>
          <Link
            to="/heritage"
            className="inline-flex items-center gap-2 text-heritage-red-600 hover:text-heritage-red-700"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('heritageDetail.backToList')}
          </Link>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-heritage-cream-50 dark:bg-gray-900">
      {/* Hero Image */}
      <div className="relative h-64 md:h-96 bg-gradient-to-br from-heritage-red-700 to-heritage-gold-600">
        {heritage.image && (
          <img
            src={heritage.image}
            alt={heritage.name}
            className="w-full h-full object-cover opacity-70"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 glass rounded-full hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        
        {/* Actions */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button
            onClick={() => toggleFavorite(heritage.id)}
            className={`p-2 rounded-full transition-colors ${
              isFavorite(heritage.id) 
                ? 'bg-heritage-red-600 text-white' 
                : 'glass text-white hover:bg-white/30'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite(heritage.id) ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="p-2 glass rounded-full text-white hover:bg-white/30 transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button
            onClick={handlePrint}
            className="p-2 glass rounded-full text-white hover:bg-white/30 transition-colors"
          >
            <Printer className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 md:p-8"
        >
          {/* Ranking Badge */}
          {(() => {
            const raw = heritage.ranking || heritage.rankingType;
            const style = getRankingStyle(raw);
            const code = normalizeRankingCode(raw);
            const rankingLabel = code ? t(`ranking.${code}`) : (raw || t('heritageDetail.culturalHeritage'));
            return (
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4 ${style.badgeCompact}`}>
                <Award className="w-4 h-4" />
                {rankingLabel}
              </div>
            );
          })()}

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {heritage.name}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-400 mb-6">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{formatHeritageLocation(heritage, t)}</span>
            </div>
            {heritage.type && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{heritage.type}</span>
              </div>
            )}
          </div>

          {/* Share Menu */}
          {showShareMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
            >
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {t('heritageDetail.shareThisHeritage')}
              </p>
              <SocialShareButtons heritage={heritage} />
            </motion.div>
          )}

          {/* Description */}
          <div className="prose prose-gray dark:prose-invert max-w-none mb-8">
            <ReactMarkdown>
              {heritage.information || t('heritageDetail.noDetailInfo')}
            </ReactMarkdown>
          </div>

          <div className="mb-8 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
              {t('detail.legalBasis')}
            </h3>
            <ul className="space-y-1.5">
              {ADMIN_LEGAL_BASIS.map((doc) => (
                <li key={doc.id}>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-heritage-red-600 hover:text-heritage-red-700 dark:text-heritage-gold-400 dark:hover:text-heritage-gold-300"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {doc.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Media Section */}
          {(heritage.audioUrl || heritage.youtubeUrl) && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('heritageDetail.multimedia')}
              </h3>
              <div className="space-y-4">
                {heritage.audioUrl && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <Volume2 className="w-5 h-5 text-heritage-red-600" />
                    <span className="text-gray-700 dark:text-gray-300">{t('heritageDetail.audioIntro')}</span>
                    <audio controls className="ml-auto">
                      <source src={heritage.audioUrl} type="audio/mpeg" />
                    </audio>
                  </div>
                )}
                {heritage.youtubeUrl && (
                  <div className="aspect-video rounded-xl overflow-hidden">
                    <iframe
                      src={heritage.youtubeUrl.replace('watch?v=', 'embed/')}
                      title={heritage.name}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* Related Heritages */}
        <RelatedHeritages currentId={heritage.id} commune={heritage.commune} />

        {/* Navigation */}
        <div className="flex justify-between items-center py-8">
          <Link
            to="/heritage"
            className="inline-flex items-center gap-2 text-heritage-red-600 dark:text-heritage-gold-400 hover:gap-3 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('heritageDetail.backToList')}
          </Link>
          <Link
            to="/map"
            className="inline-flex items-center gap-2 text-heritage-red-600 dark:text-heritage-gold-400 hover:gap-3 transition-all"
          >
            {t('heritageDetail.viewOnMap')}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

