import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Footer } from '../components/Footer';
import FloatingNavbar from '../components/navigation/FloatingNavbar';
import Breadcrumb from '../components/navigation/Breadcrumb';

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: 'easeInOut' }
};

export default function MainLayout() {
  const location = useLocation();

  // Check if current page is homepage (no breadcrumb needed)
  const isHomePage = location.pathname === '/';

  // Check if current page is admin (different layout)
  const isAdminPage = location.pathname.startsWith('/admin');

  const hideFooter = location.pathname.startsWith('/map');

  const isMapPage = location.pathname.startsWith('/map');
  const useContainer = !isHomePage && !isMapPage && !isAdminPage;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F7] dark:bg-gray-900 transition-colors duration-300">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-heritage-red-700 via-heritage-gold-500 to-heritage-red-700"></div>

      {/* Main Content */}
      <main className="flex-1 relative pb-24">
        {/* Breadcrumb (not on homepage) */}
        {!isHomePage && !isAdminPage && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <Breadcrumb />
          </div>
        )}

        {/* Page Content with Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={pageTransition.initial}
            animate={pageTransition.animate}
            exit={pageTransition.exit}
            transition={pageTransition.transition}
            className={useContainer ? 'layout-container-wide' : 'w-full'}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      {!hideFooter && <Footer />}

      {/* Decorative bottom border */}
      <div className="h-1 bg-gradient-to-r from-heritage-red-700 via-heritage-gold-500 to-heritage-red-700"></div>

      {/* Floating Bottom Navigation - Both Desktop and Mobile */}
      {/* {!hideFooter && <FloatingNavbar />} */}
      <FloatingNavbar />
    </div>
  );
}

