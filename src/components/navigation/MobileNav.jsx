import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Map, MessageSquare, Gamepad2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, useMotionValue, animate } from 'framer-motion';

export default function MobileNav() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  const navItems = [
    { path: '/', icon: Home, label: t('nav.home') },
    { path: '/heritage', icon: BookOpen, label: t('nav.heritage') },
    { path: '/map', icon: Map, label: t('nav.map') },
    { path: '/chat', icon: MessageSquare, label: t('nav.chat') },
    { path: '/quiz', icon: Gamepad2, label: t('nav.quiz') },
  ];

  // Find active index based on current path
  useEffect(() => {
    const currentIndex = navItems.findIndex(item => item.path === location.pathname);
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- navItems is stable
  }, [location.pathname]);

  // Animated indicator position
  const indicatorX = useMotionValue(0);
  const itemWidth = 100 / navItems.length; // Percentage width per item

  useEffect(() => {
    const targetX = activeIndex * (100 / navItems.length);
    animate(indicatorX, targetX, {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps -- indicatorX is motion value ref
  }, [activeIndex, navItems.length]);

  const handleNavClick = (path, index) => {
    setActiveIndex(index);
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden px-4 pb-4 pointer-events-none">
      <div
        className="glass rounded-2xl shadow-2xl mx-auto max-w-md pointer-events-auto relative overflow-hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {/* Animated indicator pill */}
        <motion.div
          className="absolute top-2 h-12 bg-gradient-to-br from-heritage-gold-400 to-heritage-gold-500 dark:from-heritage-gold-500 dark:to-heritage-gold-600 rounded-full shadow-lg"
          style={{
            left: `${activeIndex * itemWidth}%`,
            width: `${itemWidth}%`,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
          }}
        />

        {/* Navigation items */}
        <div className="flex items-center justify-around relative z-10 py-2">
          {navItems.map(({ path, icon: Icon, label }, index) => { // eslint-disable-line no-unused-vars -- Icon used in JSX below
            const isActive = activeIndex === index;

            return (
              <motion.button
                key={path}
                onClick={() => handleNavClick(path, index)}
                className="flex flex-col items-center justify-center flex-1 px-2 py-2 relative"
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.1 }}
              >
                {/* Icon */}
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    y: isActive ? -2 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors duration-300 ${
                      isActive
                        ? 'text-heritage-red-700 dark:text-heritage-red-800 stroke-[2.5]'
                        : 'text-gray-600 dark:text-gray-400 stroke-[2]'
                    }`}
                    fill={isActive ? 'currentColor' : 'none'}
                  />
                </motion.div>

                {/* Label */}
                <motion.span
                  className={`text-xs mt-1 font-medium transition-colors duration-300 ${
                    isActive
                      ? 'text-heritage-red-700 dark:text-heritage-red-800'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                  animate={{
                    scale: isActive ? 1.05 : 1,
                    fontWeight: isActive ? 600 : 500,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {label}
                </motion.span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

