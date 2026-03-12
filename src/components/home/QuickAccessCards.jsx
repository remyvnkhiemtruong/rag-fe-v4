import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Gamepad2, Map, Clock, Volume2, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

function FeatureCard({ feature, index }) {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
    >
      <Link
        to={feature.path}
        className="group block p-8 bg-white dark:bg-brand-charcoal border border-slate-100 dark:border-slate-800 rounded-2xl transition-all duration-500 hover:shadow-modern-lg hover:-translate-y-2 relative"
      >
        {/* Điểm nhấn màu sắc nhỏ ở góc - Modern touch */}
        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${feature.color} opacity-[0.03] rounded-tr-2xl group-hover:opacity-10 transition-opacity duration-500`}></div>

        <div className="relative z-10">
          {/* Icon - Thiết kế tối giản cao cấp */}
          <div className={`w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center mb-8 group-hover:scale-110 transition-all duration-500 ring-1 ring-slate-100 dark:ring-slate-800 group-hover:ring-offset-2`}>
            <Icon className={`w-7 h-7 ${feature.iconColor}`} />
          </div>

          {/* Content */}
          <h3 className="text-xl font-display font-bold text-brand-dark dark:text-white mb-4 group-hover:text-brand-accent transition-colors">
            {feature.title}
          </h3>

          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-body">
            {feature.description}
          </p>

          {/* Nút giả lập - Thêm tính hướng dẫn cho Modern UI */}
          <div className="mt-6 flex items-center text-xs font-bold tracking-wider text-slate-400 group-hover:text-brand-accent uppercase transition-colors">
            <span>Khám phá ngay</span>
            <motion.span
              className="ml-2"
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              →
            </motion.span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function QuickAccessCards() {
  const { t } = useTranslation();

  const features = [
    {
      icon: MessageSquare,
      title: t('home.features.aiChat'),
      description: t('home.features.aiChatDesc'),
      path: '/chat',
      color: 'from-sky-500 to-blue-600',
      iconColor: 'text-sky-500',
    },
    {
      icon: Gamepad2,
      title: t('home.features.quiz'),
      description: t('home.features.quizDesc'),
      path: '/quiz',
      color: 'from-rose-500 to-red-600',
      iconColor: 'text-rose-500',
    },
    {
      icon: Map,
      title: t('home.features.map'),
      description: t('home.features.mapDesc'),
      path: '/map',
      color: 'from-emerald-500 to-teal-600',
      iconColor: 'text-emerald-500',
    },
    {
      icon: Clock,
      title: t('home.features.timeline'),
      description: t('home.features.timelineDesc'),
      path: '/timeline',
      color: 'from-amber-500 to-orange-600',
      iconColor: 'text-amber-500',
    },
    {
      icon: Volume2,
      title: t('home.features.tts'),
      description: t('home.features.ttsDesc'),
      path: '/tts',
      color: 'from-violet-500 to-purple-600',
      iconColor: 'text-violet-500',
    },
    {
      icon: Heart,
      title: t('home.features.favorites'),
      description: t('home.features.favoritesDesc'),
      path: '/favorites',
      color: 'from-pink-500 to-rose-600',
      iconColor: 'text-pink-500',
    },
  ];

  return (
    <section className="section-spacing-main bg-white dark:bg-brand-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Modern Header Layout */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-brand-dark dark:text-white leading-tight mb-6">
              Hành trình khám phá <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-heritage-red-600 to-heritage-gold-600">
                Di sản Đất Mũi
              </span>
            </h2>

            <p className="text-slate-500 dark:text-slate-400 font-body text-lg">
              {t('home.features.subtitle')}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}