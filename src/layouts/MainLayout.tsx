import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Calendar, Info, BookOpen, Menu, X, Sun, Moon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { businessConfig } from '../config/businessConfig';
import { LanguageSelector } from '../components/LanguageSelector';

export const MainLayout: React.FC = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      // Por defecto oscuro (temática estética premium)
      return true;
    }
    return true;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const navLinks = [
    { name: t('home.nav'), path: '/', icon: <Calendar className="w-5 h-5 mr-2" /> },
    { name: t('about.nav'), path: '/nosotros', icon: <Info className="w-5 h-5 mr-2" /> },
    { name: t('blog.nav'), path: '/blog', icon: <BookOpen className="w-5 h-5 mr-2" /> },
  ];

  return (
    <div className={`flex flex-col min-h-screen font-${businessConfig.theme.fontFamily}`}>
      {/* Navbar Premium con Glassmorphism */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-dark-900/80 border-b border-gray-200 dark:border-dark-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex shrink-0 items-center gap-2 group">
                <svg className="w-8 h-8 text-primary-500 group-hover:text-primary-600 transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d={businessConfig.logoSvg} />
                </svg>
                <span className="font-bold text-2xl tracking-tight bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
                  {businessConfig.name}
                </span>
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden sm:flex sm:items-center sm:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                    location.pathname === link.path
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-300 dark:hover:text-white'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}

              <LanguageSelector />

              {/* Theme Toggle Button Desktop */}
              <button
                onClick={toggleTheme}
                className="ml-2 p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 focus:outline-none transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-dark-800"
                aria-label="Toggle Dark Mode"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={toggleTheme}
                className="inline-flex items-center justify-center p-2 mr-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-800 focus:outline-none"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <LanguageSelector />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-800 focus:outline-none"
              >
                <span className="sr-only">Abrir menú principal</span>
                {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="sm:hidden animate-fade-in bg-white dark:bg-dark-900 border-b border-gray-200 dark:border-dark-700">
            <div className="pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    location.pathname === link.path
                      ? 'bg-primary-50 border-primary-500 text-primary-700 dark:bg-dark-800 dark:text-primary-400'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-dark-800 dark:hover:text-white'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <Outlet />
      </main>

      {/* Footer minimalista */}
      <footer className="bg-white dark:bg-dark-900 border-t border-gray-200 dark:border-dark-700 mt-auto transition-colors duration-300">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-3">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} {businessConfig.name}. {t('footer.allRightsReserved', 'Todos los derechos reservados.')}
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-medium">
            <span>Powered by</span>
            <a href="#" className="font-bold tracking-tight text-primary-600 dark:text-primary-500 hover:text-primary-700 dark:hover:text-primary-400 transition-colors">
              KlierNav
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
