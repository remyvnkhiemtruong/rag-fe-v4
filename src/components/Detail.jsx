import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, MapPin, Calendar, Info, Volume2, Pause, Play, Loader, Landmark, Award, Star, Sparkles, Video, Image as ImageIcon } from 'lucide-react';
import { heritageApi } from '../services/api';
import { formatCategoryLabel } from '../pages/HeritageList';
import { getRankingStyle, hasDisplayableRanking, normalizeRankingCode, RANKING_CODES } from '../utils/ranking';
import { ADMIN_LEGAL_BASIS } from '../data/adminCrosswalk';
import { hasRecognizedYear } from '../utils/heritageDisplay';
export function HeritageDetailModal({ itemId, initialItem, onClose, language = 'vi' }) {
    const { t } = useTranslation();
    const [item, setItem] = useState(initialItem);
    const [loading, setLoading] = useState(!initialItem);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoadingAudio, setIsLoadingAudio] = useState(false);
    const [audioError, setAudioError] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);

                // Nếu có initialItem thì hiển thị trước (cho nhanh)
                if (initialItem) {
                    setItem(initialItem);
                }

                // Luôn fetch bản full từ API chi tiết
                if (itemId) {
                    const data = await heritageApi.getById(itemId, language);
                    setItem(data); // ghi đè lại bằng bản đầy đủ
                }

            } catch {
                // Error fetching heritage details
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [itemId, language, initialItem]);

    // Helper to extract YouTube video ID
    const getYouTubeVideoId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    useEffect(() => {
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        const audioEl = audioRef.current;
        return () => {
            document.body.style.overflow = 'unset';
            if (audioEl) {
                audioEl.pause();
                audioEl.currentTime = 0;
            }
        };
    }, []);

    const handlePlayAudio = () => {
        if (!item?.audio_url) {
            setAudioError(true);
            return;
        }

        if (!audioRef.current) return;

        // Pause if playing
        if (audioRef.current.src && !audioRef.current.paused) {
            audioRef.current.pause();
            setIsPlaying(false);
            return;
        }

        // Resume if paused
        if (audioRef.current.src && audioRef.current.paused) {
            audioRef.current.play();
            setIsPlaying(true);
            return;
        }

        // Load new audio
        setIsLoadingAudio(true);
        setAudioError(false);

        audioRef.current.src = item.audio_url;

        audioRef.current.onloadeddata = () => {
            setIsLoadingAudio(false);
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(() => {
                    setAudioError(true);
                    setIsLoadingAudio(false);
                });
        };

        audioRef.current.onended = () => {
            setIsPlaying(false);
        };

        audioRef.current.onerror = () => {
            if (import.meta.env.DEV) console.error("Audio load error");
            setAudioError(true);
            setIsPlaying(false);
            setIsLoadingAudio(false);
        };
    };

    const handleStopAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
        }
    };

    // Ranking style and label from util (language-agnostic code)
    const rankingCode = normalizeRankingCode(item.ranking_type);
    const rankingStyle = getRankingStyle(item.ranking_type);
    const showRankingBadge = hasDisplayableRanking(item.ranking_type);
    const rankingLabel = rankingCode ? t(`ranking.${rankingCode}`) : (showRankingBadge ? item.ranking_type : '');
    const RankingIcon = rankingCode === RANKING_CODES.NATIONAL_SPECIAL ? Star : rankingCode === RANKING_CODES.NATIONAL ? Award : Landmark;

    const getCategoryStyle = (category) => {
        switch (category) {
            case 'di_san':
                return {
                    badge: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
                    icon: <Landmark className="w-4 h-4" />
                };
            case 'di_tich':
                return {
                    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700',
                    icon: <Star className="w-4 h-4" />
                };
            case 'cong_trinh_nghe_thuat':
                return {
                    badge: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700',
                    icon: <Sparkles className="w-4 h-4" />
                };
            default:
                return {
                    badge: 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600',
                    icon: <Landmark className="w-4 h-4" />
                };
        }
    };


    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-heritage-earth-950/70 backdrop-blur-sm">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 flex items-center gap-4">
                    <Loader className="w-6 h-6 animate-spin text-heritage-gold-600" />
                    <span className="text-heritage-earth-900 dark:text-gray-100">{t('common.loading')}</span>
                </div>
            </div>
        );
    }

    if (!item) return null;

    const categoryStyle = getCategoryStyle(item.category);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-heritage-earth-950/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-elegant-lg max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in border border-heritage-earth-200 dark:border-gray-700">
                {/* Decorative top border */}
                <div className="h-1.5 bg-gradient-to-r from-heritage-red-700 via-heritage-gold-500 to-heritage-red-700" />

                {/* Header with Hero Image */}
                <div className="relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2.5 rounded-full bg-heritage-earth-900/70 hover:bg-heritage-earth-900 transition-colors z-10 text-white border border-heritage-gold-400/30"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Hero Image */}
                    <div className="relative h-72 overflow-hidden">
                        {item.image_url ? (
                            <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className={`bg-gradient-to-br ${rankingStyle.gradient} h-full flex items-center justify-center relative overflow-hidden`}>
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute inset-0 bg-lotus-pattern" />
                                </div>
                                <div className="relative">
                                    <div className="w-28 h-28 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/30">
                                        <Landmark className="w-14 h-14 text-white" />
                                    </div>
                                    <div className="absolute -inset-4 rounded-full border-2 border-white/20" />
                                </div>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-heritage-earth-950/80 via-heritage-earth-950/30 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-heritage-gold-400 via-heritage-gold-300 to-heritage-gold-400" />
                    </div>

                    {/* Content Over Image */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <div className="mb-3 flex flex-wrap gap-2">
                            {/* Ranking Badge */}
                            {showRankingBadge && (
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${rankingStyle.badgeSolid}`}>
                                    <RankingIcon className="w-4 h-4" />
                                    {rankingLabel}
                                </span>
                            )}

                            {/* Category Badge */}
                            {item.category && (
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${categoryStyle.badge}`}>
                                    {categoryStyle.icon}
                                    {formatCategoryLabel(item.category, t)}
                                </span>
                            )}
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-display font-bold mb-3 drop-shadow-lg">{item.name}</h2>
                        <div className="flex items-center gap-3 text-sm flex-wrap">
                            {item.year_built && (
                                <div className="flex items-center gap-1.5 bg-heritage-earth-900/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                                    <Calendar className="w-4 h-4 text-heritage-gold-400" />
                                    <span>Xây dựng: {item.year_built}</span>
                                </div>
                            )}
                            {hasRecognizedYear(item.year_ranked) && (
                                <div className="flex items-center gap-1.5 bg-heritage-earth-900/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                                    <Award className="w-4 h-4 text-heritage-gold-400" />
                                    <span>Xếp hạng: {item.year_ranked}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1.5 bg-heritage-earth-900/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                                <MapPin className="w-4 h-4 text-heritage-gold-400" />
                                <span>{item.address}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-320px)] scrollbar-heritage bg-white dark:bg-gray-800 space-y-6">
                    {/* Audio Control */}
                    {item.audio_url && (
                        <div className="p-6 rounded-xl bg-gradient-to-r from-heritage-gold-50 to-heritage-cream-100 dark:from-gray-700 dark:to-gray-700 border-2 border-heritage-gold-200 dark:border-gray-600 relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-heritage-red-600 via-heritage-gold-500 to-heritage-red-600" />

                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-heritage-gold-500 flex items-center justify-center shadow-gold">
                                        <Volume2 className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <span className="font-display font-semibold text-heritage-earth-900 dark:text-gray-100">{t('detail.listenIntro')}</span>
                                        <p className="text-xs text-heritage-earth-500 dark:text-gray-400">{t('detail.audioDescription')}</p>
                                    </div>
                                </div>
                                {isPlaying && (
                                    <div className="flex gap-1 items-end h-6">
                                        {[...Array(5)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-1 bg-heritage-gold-500 dark:bg-heritage-gold-400 rounded-full animate-pulse"
                                                style={{
                                                    height: `${12 + (i % 3) * 6}px`,
                                                    animationDelay: `${i * 0.15}s`
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handlePlayAudio}
                                    disabled={isLoadingAudio}
                                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${isLoadingAudio
                                        ? 'bg-heritage-earth-200 cursor-not-allowed text-heritage-earth-500'
                                        : isPlaying
                                            ? 'bg-gradient-to-r from-heritage-gold-500 to-heritage-gold-600 text-white shadow-gold'
                                            : 'bg-gradient-to-r from-heritage-red-700 to-heritage-red-800 text-white shadow-heritage'
                                        }`}
                                >
                                    {isLoadingAudio ? (
                                        <>
                                            <Loader className="w-5 h-5 animate-spin" />
                                            {t('common.loading')}
                                        </>
                                    ) : isPlaying ? (
                                        <>
                                            <Pause className="w-5 h-5" />
                                            {t('videoDetail.pause')}
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-5 h-5" />
                                            {t('videoDetail.playAudio')}
                                        </>
                                    )}
                                </button>

                                {isPlaying && (
                                    <button
                                        onClick={handleStopAudio}
                                        className="px-6 py-3 rounded-xl font-semibold bg-heritage-earth-100 dark:bg-gray-600 text-heritage-earth-700 dark:text-gray-200 hover:bg-heritage-earth-200 dark:hover:bg-gray-500 transition-colors border border-heritage-earth-200 dark:border-gray-500"
                                    >
                                        {t('detail.stop')}
                                    </button>
                                )}
                            </div>

                            {audioError && (
                                <p className="text-sm text-heritage-red-600 mt-3 flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-heritage-red-100 flex items-center justify-center text-heritage-red-600">!</span>
                                    {t('detail.audioError')}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Music audio (file âm thanh âm nhạc) */}
                    {item.music_audio_url && (
                        <div className="p-6 rounded-xl bg-gradient-to-r from-emerald-50 to-heritage-cream-100 dark:from-gray-700 dark:to-gray-700 border-2 border-emerald-200 dark:border-gray-600">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                                    <Volume2 className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <span className="font-display font-semibold text-heritage-earth-900 dark:text-gray-100">{t('detail.music')}</span>
                                    <p className="text-xs text-heritage-earth-500 dark:text-gray-400">{t('detail.musicAudio')}</p>
                                </div>
                            </div>
                            <audio controls className="w-full mt-2 h-10">
                                <source src={item.music_audio_url} />
                                {t('detail.browserNoAudio')}
                            </audio>
                        </div>
                    )}

                    {/* YouTube Videos */}
                    {item.youtube_links && item.youtube_links.length > 0 && (
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-heritage-red-100 dark:bg-heritage-red-900/30 flex items-center justify-center border border-heritage-red-200 dark:border-heritage-red-700">
                                    <Video className="w-5 h-5 text-heritage-red-700 dark:text-heritage-red-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-display font-bold text-heritage-earth-900 dark:text-gray-100">
                                        {t('videoDetail.videoIntro', { count: item.youtube_links.length })}
                                    </h3>
                                    <p className="text-xs text-heritage-earth-500 dark:text-gray-400">{t('videoDetail.learnMoreVideo')}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {item.youtube_links.map((video) => {
                                    const videoId = getYouTubeVideoId(video.url);
                                    return (
                                        <div key={video.id} className="rounded-xl overflow-hidden border-2 border-heritage-red-200 dark:border-gray-600">
                                            {videoId ? (
                                                <div className="relative pb-[56.25%] h-0">
                                                    <iframe
                                                        src={`https://www.youtube.com/embed/${videoId}`}
                                                        className="absolute top-0 left-0 w-full h-full"
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                        title={`Video ${video.order}`}
                                                    />
                                                </div>
                                            ) : (
                                                <a
                                                    href={video.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center h-32 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                >
                                                    <Video className="w-8 h-8 text-gray-400 mr-2" />
                                                    <span className="text-gray-600 dark:text-gray-300">{t('videoDetail.watchVideo')}</span>
                                                </a>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Gallery */}
                    {item.gallery && item.gallery.length > 0 && (
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-heritage-jade-100 dark:bg-heritage-jade-900/30 flex items-center justify-center border border-heritage-jade-200 dark:border-heritage-jade-700">
                                    <ImageIcon className="w-5 h-5 text-heritage-jade-700 dark:text-heritage-jade-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-display font-bold text-heritage-earth-900 dark:text-gray-100">
                                        {t('detail.imageGallery')} ({item.gallery.length})
                                    </h3>
                                    <p className="text-xs text-heritage-earth-500 dark:text-gray-400">{t('detail.imageGallery')}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {item.gallery.map((img) => (
                                    <div key={img.id} className="relative group overflow-hidden rounded-lg border-2 border-heritage-earth-200 dark:border-gray-600">
                                        <img
                                            src={img.url}
                                            alt={`Gallery ${img.order}`}
                                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Information */}
                    {item.information && (
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-heritage-red-100 dark:bg-heritage-red-900/30 flex items-center justify-center border border-heritage-red-200 dark:border-heritage-red-700">
                                    <Info className="w-5 h-5 text-heritage-red-700 dark:text-heritage-red-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-display font-bold text-heritage-earth-900 dark:text-gray-100">
                                        {t('detail.information')}
                                    </h3>
                                    <p className="text-xs text-heritage-earth-500 dark:text-gray-400">{t('detail.historyAndCulture')}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-heritage-gold-400 dark:via-heritage-gold-600 to-transparent" />
                                <Sparkles className="w-4 h-4 text-heritage-gold-500 dark:text-heritage-gold-400" />
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-heritage-gold-400 dark:via-heritage-gold-600 to-transparent" />
                            </div>

                            <p className="text-heritage-earth-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                {item.information}
                            </p>
                        </div>
                    )}

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {item.commune && (
                            <div className="p-4 rounded-xl bg-heritage-cream-50 dark:bg-gray-700 border border-heritage-earth-200 dark:border-gray-600">
                                <div className="flex items-center gap-2 text-sm text-heritage-earth-500 dark:text-gray-400 mb-1">
                                    <MapPin className="w-4 h-4 text-heritage-gold-500" />
                                    <span>{t('detail.commune')}</span>
                                </div>
                                <div className="font-semibold text-heritage-earth-900 dark:text-gray-100">{item.commune}</div>
                            </div>
                        )}

                        {item.district && (
                            <div className="p-4 rounded-xl bg-heritage-cream-50 dark:bg-gray-700 border border-heritage-earth-200 dark:border-gray-600">
                                <div className="flex items-center gap-2 text-sm text-heritage-earth-500 dark:text-gray-400 mb-1">
                                    <MapPin className="w-4 h-4 text-heritage-gold-500" />
                                    <span>{t('detail.district')}</span>
                                </div>
                                <div className="font-semibold text-heritage-earth-900 dark:text-gray-100">{item.district}</div>
                            </div>
                        )}

                        {item.province && (
                            <div className="p-4 rounded-xl bg-heritage-cream-50 dark:bg-gray-700 border border-heritage-earth-200 dark:border-gray-600">
                                <div className="flex items-center gap-2 text-sm text-heritage-earth-500 dark:text-gray-400 mb-1">
                                    <MapPin className="w-4 h-4 text-heritage-red-600 dark:text-heritage-red-400" />
                                    <span>{t('detail.province')}</span>
                                </div>
                                <div className="font-semibold text-heritage-earth-900 dark:text-gray-100">{item.province}</div>
                            </div>
                        )}

                        {showRankingBadge && (
                            <div className="p-4 rounded-xl bg-heritage-cream-50 dark:bg-gray-700 border border-heritage-earth-200 dark:border-gray-600">
                                <div className="flex items-center gap-2 text-sm text-heritage-earth-500 dark:text-gray-400 mb-1">
                                    <Award className="w-4 h-4 text-heritage-gold-500" />
                                    <span>{t('detail.rankingType')}</span>
                                </div>
                                <div className="font-semibold text-heritage-earth-900 dark:text-gray-100">{rankingLabel}</div>
                            </div>
                        )}
                    </div>

                    {/* Legal Basis */}
                    <div className="p-4 rounded-xl bg-heritage-cream-50 dark:bg-gray-700 border border-heritage-earth-200 dark:border-gray-600">
                        <div className="flex items-center gap-2 text-sm text-heritage-earth-500 dark:text-gray-400 mb-2">
                            <Landmark className="w-4 h-4 text-heritage-gold-500" />
                            <span>{t('detail.legalBasis')}</span>
                        </div>
                        <ul className="space-y-1.5">
                            {ADMIN_LEGAL_BASIS.map((doc) => (
                                <li key={doc.id}>
                                    <a
                                        href={doc.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-heritage-red-700 dark:text-heritage-gold-300 hover:underline"
                                    >
                                        {doc.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-heritage-earth-200 dark:border-gray-700 bg-heritage-cream-50 dark:bg-gray-800">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 text-sm text-heritage-earth-500 dark:text-gray-400">
                                <Landmark className="w-4 h-4 text-heritage-gold-500" />
                                <span>{t('videoDetail.codeNumber')}: <span className="font-semibold text-heritage-earth-700 dark:text-gray-200">#{item.id}</span></span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-lg bg-heritage-earth-800 hover:bg-heritage-earth-900 dark:bg-gray-600 dark:hover:bg-gray-500 text-white font-semibold transition-colors shadow-elegant"
                        >
                            {t('common.close')}
                        </button>
                    </div>
                </div>

                {/* Decorative bottom border */}
                <div className="h-1 bg-gradient-to-r from-heritage-red-700 via-heritage-gold-500 to-heritage-red-700" />
            </div>

            <audio ref={audioRef} className="hidden" />
        </div>
    );
}
