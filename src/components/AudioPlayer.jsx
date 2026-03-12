import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  RotateCcw,
  Loader2,
  Globe
} from 'lucide-react';

const languages = [
  { code: 'vi', flag: '????' },
  { code: 'en', flag: '????' },
  { code: 'zh', flag: '????' },
  { code: 'km', flag: '????' },
];

export function AudioPlayer({ audioSrc, title, onLanguageChange, currentLanguage = 'vi' }) {
  const { t } = useTranslation();
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const isDraggingRef = useRef(false);
  const previewTimeRef = useRef(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewTime, setPreviewTime] = useState(null);
  const [previewPosition, setPreviewPosition] = useState(0);

  // Format time to mm:ss
  const formatTime = (time) => {
    if (isNaN(time) || !isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle play/pause
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        setError(t('audio.error'));
      });
    }
  };

  // Calculate time and position from clientX or touch
  const calculateTimeFromPosition = (clientX) => {
    if (!progressRef.current) return null;

    const rect = progressRef.current.getBoundingClientRect();
    const posX = clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, posX / width));
    const time = percentage * duration;

    return { time, percentage, position: posX };
  };

  // Handle seek (mouse click)
  const handleSeek = (e) => {
    if (!audioRef.current || isDraggingRef.current) return;

    const result = calculateTimeFromPosition(e.clientX);
    if (result) {
      audioRef.current.currentTime = result.time;
      setCurrentTime(result.time);
    }
  };

  // Touch event handlers
  const handleTouchStart = (e) => {
    isDraggingRef.current = true;
    setIsDragging(true);

    const touch = e.touches[0];
    const result = calculateTimeFromPosition(touch.clientX);
    if (result) {
      previewTimeRef.current = result.time;
      setPreviewTime(result.time);
      setPreviewPosition(result.percentage);
    }
  };

  const handleTouchMove = (e) => {
    if (!isDraggingRef.current) return;
    e.preventDefault(); // Prevent scrolling while dragging

    const touch = e.touches[0];
    const result = calculateTimeFromPosition(touch.clientX);
    if (result) {
      previewTimeRef.current = result.time;
      setPreviewTime(result.time);
      setPreviewPosition(result.percentage);
    }
  };

  const handleTouchEnd = () => {
    if (!isDraggingRef.current) return;

    isDraggingRef.current = false;
    setIsDragging(false);

    if (audioRef.current && previewTimeRef.current !== null) {
      audioRef.current.currentTime = previewTimeRef.current;
      setCurrentTime(previewTimeRef.current);
    }

    setPreviewTime(null);
    previewTimeRef.current = 0;
  };

  // Mouse drag handlers (for desktop)
  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    setIsDragging(true);

    const result = calculateTimeFromPosition(e.clientX);
    if (result) {
      previewTimeRef.current = result.time;
      setPreviewTime(result.time);
      setPreviewPosition(result.percentage);
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;

      const result = calculateTimeFromPosition(e.clientX);
      if (result) {
        previewTimeRef.current = result.time;
        setPreviewTime(result.time);
        setPreviewPosition(result.percentage);
      }
    };

    const handleMouseUp = () => {
      if (!isDraggingRef.current) return;

      isDraggingRef.current = false;
      setIsDragging(false);

      if (audioRef.current && previewTimeRef.current !== null) {
        audioRef.current.currentTime = previewTimeRef.current;
        setCurrentTime(previewTimeRef.current);
      }

      setPreviewTime(null);
      previewTimeRef.current = 0;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- calculateTimeFromPosition is stable
  }, [isDragging, duration]);

  // Handle skip forward/backward
  const skipForward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.min(duration, currentTime + 10);
  };

  const skipBackward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, currentTime - 10);
  };

  // Keyboard navigation for seek bar
  const handleProgressKeyDown = (e) => {
    if (!audioRef.current) return;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        audioRef.current.currentTime = Math.max(0, currentTime - 5);
        break;
      case 'ArrowRight':
        e.preventDefault();
        audioRef.current.currentTime = Math.min(duration, currentTime + 5);
        break;
      case 'Home':
        e.preventDefault();
        audioRef.current.currentTime = 0;
        break;
      case 'End':
        e.preventDefault();
        audioRef.current.currentTime = duration;
        break;
      default:
        break;
    }
  };

  // Handle restart
  const restart = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  // Toggle mute
  const toggleMute = () => {
    if (!audioRef.current) return;

    if (isMuted) {
      audioRef.current.volume = volume || 1;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  // Handle language change
  const handleLanguageSelect = (langCode) => {
    setShowLangDropdown(false);
    if (onLanguageChange) {
      onLanguageChange(langCode);
    }
  };

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const handleError = () => {
      setIsLoading(false);
      setError(t('audio.error'));
    };

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [t]);

  // Reset error when audio source changes
  useEffect(() => {
    setError(null);
    setCurrentTime(0);
    setIsPlaying(false);
  }, [audioSrc]);

  // Calculate progress percentage
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const displayPercent = isDragging ? previewPosition * 100 : progressPercent;

  const currentLang = languages.find(l => l.code === currentLanguage) || languages[0];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-4">
      {/* Hidden audio element */}
      <audio ref={audioRef} src={audioSrc} preload="metadata" />

      {/* Title and Language Selector */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Volume2 className="w-5 h-5 text-heritage-gold-600 flex-shrink-0" />
          <span className="font-medium text-gray-800 dark:text-gray-200 truncate">
            {title || t('audio.audioDescription')}
          </span>
        </div>

        {/* Language Selector */}
        {onLanguageChange && (
          <div className="relative">
            <button
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
            >
              <Globe className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-base">{currentLang.flag}</span>
            </button>

            {showLangDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowLangDropdown(false)}
                />
                <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageSelect(lang.code)}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        currentLanguage === lang.code
                          ? 'bg-heritage-red-50 dark:bg-heritage-red-900/20 text-heritage-red-700 dark:text-heritage-red-400'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="text-sm">{t(`language.${lang.code}`)}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="text-center py-4 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-4">
        <div
          ref={progressRef}
          onClick={handleSeek}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onKeyDown={handleProgressKeyDown}
          role="slider"
          aria-label={t('audio.seekSlider') || 'Audio seek slider'}
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={currentTime}
          aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
          tabIndex={0}
          className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer group touch-none"
          style={{ touchAction: 'none' }}
        >
          {/* Progress fill */}
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-heritage-red-600 to-heritage-gold-500 rounded-full transition-all"
            style={{ width: `${displayPercent}%` }}
          />
          {/* Seek handle - larger and always visible on mobile, hover visible on desktop */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white dark:bg-gray-200 border-2 border-heritage-red-600 rounded-full shadow-lg transition-all ${
              isDragging
                ? 'opacity-100 scale-125'
                : 'opacity-100 md:opacity-0 md:group-hover:opacity-100 scale-100'
            }`}
            style={{ left: `calc(${displayPercent}% - 10px)` }}
          />

          {/* Time preview tooltip - shown while dragging */}
          {isDragging && previewTime !== null && (
            <div
              className="absolute -top-10 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs py-1 px-2 rounded shadow-lg pointer-events-none z-10"
              style={{ left: `${displayPercent}%` }}
            >
              {formatTime(previewTime)}
              <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
            </div>
          )}
        </div>

        {/* Time display */}
        <div className="flex justify-between mt-1.5 text-xs text-gray-500 dark:text-gray-400">
          <span aria-live="off">{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Left controls - Skip back, Play/Pause, Skip forward */}
        <div className="flex items-center gap-2">
          {/* Restart */}
          <button
            onClick={restart}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
            title={t('audio.restart') || 'Restart'}
            aria-label={t('audio.restart') || 'Restart audio'}
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Skip backward 10s */}
          <button
            onClick={skipBackward}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
            title={t('audio.skipBack') || 'Skip back 10 seconds'}
            aria-label={t('audio.skipBack') || 'Skip back 10 seconds'}
          >
            <SkipBack className="w-5 h-5" />
          </button>

          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            disabled={isLoading || !!error}
            className="p-3 rounded-full bg-heritage-red-700 hover:bg-heritage-red-800 text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            aria-label={isPlaying ? (t('audio.pause') || 'Pause') : (t('audio.play') || 'Play')}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>

          {/* Skip forward 10s */}
          <button
            onClick={skipForward}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
            title={t('audio.skipForward') || 'Skip forward 10 seconds'}
            aria-label={t('audio.skipForward') || 'Skip forward 10 seconds'}
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Right controls - Volume */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-400"
            aria-label={isMuted ? (t('audio.unmute') || 'Unmute') : (t('audio.mute') || 'Mute')}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            aria-label={t('audio.volume') || 'Volume'}
            className="w-20 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-heritage-red-600"
          />
        </div>
      </div>

      {/* Keyboard shortcuts hint */}
      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          ← -10s | Space: {t('audio.play')}/{t('audio.pause')} | +10s →
        </p>
      </div>
    </div>
  );
}

export default AudioPlayer;
