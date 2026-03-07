import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Trophy, RotateCcw, ArrowRight, Sparkles, CheckCircle, XCircle, Landmark, Award, Brain, Share2, Twitter, Facebook, Link2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { getRandomQuestions } from '../data/quiz';

export default function QuizPage() {
  const { t } = useTranslation();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [, setSpinning] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Khởi tạo bộ 10 câu hỏi ngẫu nhiên
  useEffect(() => {
    setQuestions(getRandomQuestions(10));
  }, []);

  // Confetti effect for good scores
  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Create confetti from two different positions
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#991B1B', '#B91C1C', '#DC2626', '#EAB308', '#FBBF24', '#FCD34D']
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#991B1B', '#B91C1C', '#DC2626', '#EAB308', '#FBBF24', '#FCD34D']
      });
    }, 250);
  };

  // Animate score counter when results are shown
  useEffect(() => {
    if (showResult) {
      const percentage = (score / questions.length) * 100;

      // Trigger confetti for good scores (>=70%)
      if (percentage >= 70) {
        setTimeout(() => triggerConfetti(), 500);
      }

      // Animate score counter
      let currentScore = 0;
      const increment = score / 30; // 30 steps for smooth animation
      const timer = setInterval(() => {
        currentScore += increment;
        if (currentScore >= score) {
          setAnimatedScore(score);
          clearInterval(timer);
        } else {
          setAnimatedScore(Math.floor(currentScore));
        }
      }, 50);

      return () => clearInterval(timer);
    }
    // Intentionally omit questions.length: animation runs once for current result only
  }, [showResult, score]); // eslint-disable-line react-hooks/exhaustive-deps

  // Share functionality
  const shareResults = (platform) => {
    const percentage = Math.round((score / questions.length) * 100);
    const text = `I scored ${score}/${questions.length} (${percentage}%) on the Roman Heritage Quiz! 🏛️ Test your knowledge too!`;
    const url = window.location.href;

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(`${text} ${url}`);
        setShowShareMenu(false);
        // Could add a toast notification here
        break;
    }
  };

  const handleAnswer = (index) => {
    if (answered) return;

    setSelectedAnswer(index);
    setAnswered(true);

    if (index === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    setSpinning(true);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setAnswered(false);
      } else {
        setShowResult(true);
      }
      setSpinning(false);
    }, 600);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswered(false);
    setSpinning(false);
    setAnimatedScore(0);
    setShowShareMenu(false);
    setQuestions(getRandomQuestions(10));
  };

  // Loading khi chưa có bộ câu hỏi
  if (!questions.length) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600 dark:text-gray-300">{t('common.loading')}</p>
      </div>
    );
  }

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return t('quiz.excellentMsg');
    if (percentage >= 80) return t('quiz.goodMsg');
    if (percentage >= 60) return t('quiz.fairMsg');
    if (percentage >= 40) return t('quiz.averageMsg');
    return t('quiz.needImprovementMsg');
  };

  const getScoreGrade = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return { label: t('quiz.excellent'), color: 'text-heritage-gold-600 dark:text-heritage-gold-400' };
    if (percentage >= 80) return { label: t('quiz.good'), color: 'text-emerald-600 dark:text-emerald-400' };
    if (percentage >= 60) return { label: t('quiz.fair'), color: 'text-heritage-gold-700 dark:text-heritage-gold-400' };
    if (percentage >= 40) return { label: t('quiz.average'), color: 'text-gray-600 dark:text-gray-400' };
    return { label: t('quiz.needImprovement'), color: 'text-heritage-red-600 dark:text-heritage-red-400' };
  };

  // Result Screen
  if (showResult) {
    const grade = getScoreGrade();
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8 min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 sm:p-10 max-w-lg w-full text-center overflow-hidden theme-transition"
        >
          {/* Decorative top border */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-heritage-red-700 via-heritage-gold-500 to-heritage-red-700" />

          {/* Circular Progress Indicator with Trophy */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
            className="relative inline-block mb-6"
          >
            {/* SVG Circular Progress */}
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-gray-200 dark:text-gray-700"
              />
              {/* Progress circle */}
              <motion.circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                className={percentage >= 70 ? "text-heritage-gold-500" : "text-heritage-red-500"}
                initial={{ strokeDasharray: "339.292", strokeDashoffset: "339.292" }}
                animate={{ strokeDashoffset: `${339.292 - (339.292 * percentage) / 100}` }}
                transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            {/* Trophy in center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
              >
                <Trophy className="w-12 h-12 text-heritage-gold-600 dark:text-heritage-gold-400" />
              </motion.div>
            </div>
            {/* Percentage text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-2xl font-bold text-heritage-red-700 dark:text-heritage-red-400"
            >
              {percentage}%
            </motion.div>
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-display font-bold text-gray-900 dark:text-gray-100 mb-2 mt-6"
          >
            {t('quiz.result')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={`text-lg font-semibold ${grade.color} mb-6`}
          >
            {grade.label}
          </motion.p>

          {/* Animated Score */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="relative inline-block mb-6"
          >
            <div className="text-5xl font-bold text-heritage-red-700 dark:text-heritage-red-400">
              {animatedScore}
              <span className="text-2xl text-gray-400 dark:text-gray-500">/{questions.length}</span>
            </div>
          </motion.div>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed"
          >
            {getScoreMessage()}
          </motion.p>

          {/* Progress visualization */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-8"
          >
            <div className="flex justify-center gap-1.5 mb-2">
              {questions.map((_, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 + idx * 0.05 }}
                  className={`w-3 h-3 rounded-full ${
                    idx < score
                      ? 'bg-emerald-500'
                      : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('quiz.correctAnswers', { score, total: questions.length })}
            </p>
          </motion.div>

          {/* Share Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mb-4 relative"
          >
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-heritage-gold-600 to-heritage-gold-700 text-white rounded-xl font-medium hover:from-heritage-gold-700 hover:to-heritage-gold-800 transition-all shadow-md mr-3"
            >
              <Share2 className="w-5 h-5" />
              {t('common.shareResults')}
            </button>

            {/* Share Menu */}
            <AnimatePresence>
              {showShareMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-1/2 transform -translate-x-1/2 mt-2 bg-white dark:bg-gray-700 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 p-2 z-10"
                >
                  <button
                    onClick={() => shareResults('twitter')}
                    className="flex items-center gap-2 w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                    {t('common.twitter')}
                  </button>
                  <button
                    onClick={() => shareResults('facebook')}
                    className="flex items-center gap-2 w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                    {t('common.facebook')}
                  </button>
                  <button
                    onClick={() => shareResults('copy')}
                    className="flex items-center gap-2 w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors"
                  >
                    <Link2 className="w-4 h-4" />
                    {t('common.copyLink')}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Restart Button */}
            <button
              onClick={resetQuiz}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-heritage-red-700 to-heritage-red-800 text-white rounded-xl font-medium hover:from-heritage-red-800 hover:to-heritage-red-900 transition-all shadow-md"
            >
              <RotateCcw className="w-5 h-5" />
              {t('quiz.playAgain')}
            </button>
          </motion.div>

          {/* Decorative corner elements */}
          <div className="absolute bottom-4 right-4 opacity-10 dark:opacity-5">
            <Landmark className="w-16 h-16 text-heritage-gold-600" />
          </div>
        </motion.div>
      </div>
    );
  }

  // Quiz Screen
  return (
    <div className="flex items-center justify-center p-3 sm:p-4 lg:p-6 xl:p-8 min-h-[80vh]">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-heritage-gold-500 flex items-center justify-center shadow-md">
                <Brain className="w-6 h-6 text-heritage-red-800 dark:text-gray-900" />
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                {t('quiz.title')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {t('quiz.subtitle')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 mb-6 overflow-hidden relative theme-transition"
        >
          {/* Decorative top accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-heritage-red-600 via-heritage-gold-500 to-heritage-red-600" />

          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <motion.div
                key={currentQuestion}
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-10 h-10 rounded-lg bg-heritage-red-100 dark:bg-heritage-red-900/30 flex items-center justify-center border border-heritage-red-200 dark:border-heritage-red-700"
              >
                <span className="text-heritage-red-700 dark:text-heritage-red-400 font-bold">{currentQuestion + 1}</span>
              </motion.div>
              <div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t('quiz.question')} {currentQuestion + 1} / {questions.length}
                </span>
              </div>
            </div>
            <motion.div
              key={`score-${score}`}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex items-center gap-2 px-4 py-2 bg-heritage-gold-50 dark:bg-heritage-gold-900/30 rounded-lg border border-heritage-gold-200 dark:border-heritage-gold-700"
            >
              <Award className="w-4 h-4 text-heritage-gold-600 dark:text-heritage-gold-400" />
              <span className="text-sm font-semibold text-heritage-gold-700 dark:text-heritage-gold-300">
                {t('quiz.score')}: {score}
              </span>
            </motion.div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-heritage-red-600 via-heritage-gold-500 to-heritage-red-600 h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-1.5 mt-3">
            {questions.map((_, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx < currentQuestion
                    ? 'bg-emerald-500'
                    : idx === currentQuestion
                    ? 'bg-heritage-gold-500'
                    : 'bg-gray-200 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Question Card with AnimatePresence for smooth transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 sm:p-8 overflow-hidden theme-transition"
          >
            {/* Decorative top border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-heritage-red-700 via-heritage-gold-500 to-heritage-red-700" />

            {/* Question */}
            <div className="mb-8">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-heritage-red-100 dark:bg-heritage-red-900/30 flex items-center justify-center flex-shrink-0 border border-heritage-red-200 dark:border-heritage-red-700">
                  <Sparkles className="w-4 h-4 text-heritage-red-600 dark:text-heritage-red-400" />
                </div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 leading-relaxed"
                >
                  {questions[currentQuestion].question}
                </motion.h2>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {questions[currentQuestion].options.map((option, index) => {
                const isCorrect = index === questions[currentQuestion].correct;
                const isSelected = index === selectedAnswer;

                let buttonClass = `
                  w-full p-4 sm:p-5 rounded-xl text-left font-medium transition-all duration-200
                  flex items-center gap-4 group
                `;

                let iconContent = null;

                if (answered) {
                  if (isCorrect) {
                    buttonClass += ' bg-emerald-50 dark:bg-emerald-900/30 border-2 border-emerald-500 dark:border-emerald-600 text-emerald-800 dark:text-emerald-200';
                    iconContent = <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
                  } else if (isSelected) {
                    buttonClass += ' bg-red-50 dark:bg-red-900/30 border-2 border-red-400 dark:border-red-600 text-red-800 dark:text-red-200';
                    iconContent = <XCircle className="w-6 h-6 text-red-500 dark:text-red-400" />;
                  } else {
                    buttonClass += ' bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400';
                  }
                } else {
                  buttonClass += ' bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:border-heritage-gold-400 dark:hover:border-heritage-gold-500 hover:bg-heritage-gold-50 dark:hover:bg-heritage-gold-900/20 hover:shadow-sm cursor-pointer';
                }

                return (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={!answered ? { scale: 1.02, x: 5 } : {}}
                    whileTap={!answered ? { scale: 0.98 } : {}}
                    onClick={() => handleAnswer(index)}
                    disabled={answered}
                    className={buttonClass}
                  >
                    {/* Option letter */}
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 transition-colors ${
                          answered
                            ? isCorrect
                              ? 'bg-emerald-500 text-white'
                              : isSelected
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                            : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 group-hover:bg-heritage-gold-400 group-hover:text-white'
                        }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>

                    {/* Option text */}
                    <span className="flex-1 text-base sm:text-lg">{option}</span>

                    {/* Result icon */}
                    {answered && iconContent}
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {answered && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-heritage-gold-50 dark:bg-heritage-gold-900/20 border-l-4 border-heritage-gold-500 p-4 rounded-r-lg overflow-hidden"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-heritage-gold-100 dark:bg-heritage-gold-900/50 flex items-center justify-center flex-shrink-0">
                      <Landmark className="w-4 h-4 text-heritage-gold-600 dark:text-heritage-gold-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-heritage-gold-800 dark:text-heritage-gold-300 mb-1">{t('quiz.explanation')}</p>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {questions[currentQuestion].explanation}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next Button */}
            <AnimatePresence>
              {answered && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={nextQuestion}
                  className="w-full bg-gradient-to-r from-heritage-red-700 to-heritage-red-800 text-white py-3.5 rounded-xl font-medium text-lg hover:from-heritage-red-800 hover:to-heritage-red-900 transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  {currentQuestion < questions.length - 1 ? (
                    <>
                      {t('quiz.nextQuestion')}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      {t('quiz.viewResult')}
                      <Trophy className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              )}
            </AnimatePresence>

            {/* Decorative corner ornament */}
            <div className="absolute bottom-4 right-4 opacity-10 dark:opacity-5 pointer-events-none">
              <div className="w-20 h-20 border-4 border-heritage-gold-500 rounded-full" />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
