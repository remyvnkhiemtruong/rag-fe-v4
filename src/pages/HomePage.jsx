import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  HeroSection,
  QuickAccessCards
} from '../components/home';
import PopularDestinations from '../components/home/PopularDestination';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      {/* 1. Hero Section - Inspire */}
      <HeroSection />

      <PopularDestinations />

      {/* 7. Quick Access Cards - Engage Actively */}
      <QuickAccessCards />

      {/* 8. Call to Action Section - Convert to Action */}
      <section className="section-spacing-main relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="bg.jpg"
            alt="Heritage CTA background"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-heritage-black-900/60 via-heritage-black-800/50 to-heritage-black-900/60"></div>

        {/* Decorative Elements */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-1/2 -right-1/4 w-1/2 h-full bg-heritage-gold-500/10 rounded-full blur-3xl"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              {t('home.cta.title1')}
              <span className="block text-heritage-gold-400">{t('home.cta.title2')}</span>
            </h2>

            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              {t('home.cta.subtitle')}
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              {/* Primary Action */}
              <a href="/heritage" className="px-8 py-4 bg-heritage-red-700 text-white rounded-xl font-bold shadow-xl hover:bg-heritage-red-800 transition-all">
                {t('home.cta.startJourney')}
              </a>

              {/* Secondary Action */}
              <a href="/map" className="px-8 py-4 bg-white/10 border border-white/30 text-white backdrop-blur-sm rounded-xl font-semibold hover:bg-white/20 transition-all">
                {t('home.cta.exploreMap')}
              </a>  
              <a
                href="/quiz"
                className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-300"
              >
                {t('home.cta.takeQuiz') || 'Take a Quiz'}
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}