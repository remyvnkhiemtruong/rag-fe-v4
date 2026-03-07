import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { Lock, User, Eye, EyeOff, Landmark, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = login(username, password);

    if (!result.success) {
      setError(t('admin.loginError'));
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-heritage-cream-50 via-heritage-cream-100 to-heritage-cream-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 theme-transition">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-heritage-red-200/20 dark:bg-heritage-red-900/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-heritage-gold-200/20 dark:bg-heritage-gold-900/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-elegant border border-heritage-earth-200 dark:border-gray-700 overflow-hidden theme-transition">
          {/* Header */}
          <div className="bg-gradient-to-r from-heritage-red-800 via-heritage-red-700 to-heritage-red-800 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 px-6 py-8 text-center relative overflow-hidden">
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-lotus-pattern" />
            </div>

            {/* Gold accent */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-heritage-gold-400 via-heritage-gold-300 to-heritage-gold-400" />

            <div className="relative z-10">
              {/* Logo */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-heritage-gold-500 shadow-gold mb-4">
                <Landmark className="w-8 h-8 text-heritage-red-800 dark:text-gray-900" />
              </div>

              <h1 className="text-2xl font-display font-bold text-white mb-1">
                {t('admin.title')}
              </h1>
              <p className="text-heritage-gold-300 text-sm">
                {t('common.appName')}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Error message */}
            {error && (
              <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-heritage-earth-700 dark:text-gray-300 mb-1.5">
                {t('admin.username')}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-heritage-earth-400 dark:text-gray-500" />
                <input
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-heritage-earth-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-heritage-red-500 focus:border-heritage-red-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-heritage-earth-700 dark:text-gray-300 mb-1.5">
                {t('admin.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-heritage-earth-400 dark:text-gray-500" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-heritage-earth-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-heritage-red-500 focus:border-heritage-red-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-heritage-earth-400 dark:text-gray-500 hover:text-heritage-earth-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-heritage-red-700 to-heritage-red-800 dark:from-heritage-red-600 dark:to-heritage-red-700 text-white font-medium rounded-xl hover:from-heritage-red-800 hover:to-heritage-red-900 dark:hover:from-heritage-red-700 dark:hover:to-heritage-red-800 focus:ring-2 focus:ring-heritage-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {t('common.loading')}
                </span>
              ) : (
                t('admin.loginButton')
              )}
            </button>

            {/* Demo credentials hint */}
            <div className="text-center pt-4 border-t border-heritage-earth-100 dark:border-gray-700">
              <p className="text-sm text-heritage-earth-500 dark:text-gray-400">
                {t('admin.demoCredentials')}
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-sm text-heritage-earth-500 dark:text-gray-400">
          {t('footer.copyright')}
        </p>
      </div>
    </div>
  );
}
