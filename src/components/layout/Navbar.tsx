import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Globe } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';
import { availableLanguages, translations } from '../../data/mockData';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout, setUserLanguage } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const location = useLocation();
  
  const currentLanguage = user?.language || 'en';
  const t = translations[currentLanguage as keyof typeof translations] || translations.en;
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const toggleLanguageMenu = () => {
    setIsLanguageMenuOpen(!isLanguageMenuOpen);
  };
  
  const handleLanguageChange = (code: string) => {
    setUserLanguage(code);
    setIsLanguageMenuOpen(false);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200' : '';
  };

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/app" className="flex items-center">
                <span className="text-xl font-bold text-primary-600 dark:text-primary-400">Dylets</span>
              </Link>
            </div>
          </div>
          
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            {isAuthenticated && (
              <>
                <Link to="/app" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/app')}`}>
                  {t.dashboard}
                </Link>
                <Link to="/app/loans" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/app/loans')}`}>
                  {t.loans}
                </Link>
                <Link to="/app/apply" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/app/apply')}`}>
                  {t.apply}
                </Link>
                <Link to="/app/coolers" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/app/coolers')}`}>
                  {t.coolers}
                </Link>
                <Link to="/app/impact" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/app/impact')}`}>
                  {t.impact}
                </Link>
                <Link to="/app/marketplace" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/app/marketplace')}`}>
                  {t.marketplace}
                </Link>
              </>
            )}
          </div>
          
          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {isAuthenticated && (
              <div className="relative ml-3">
                <button
                  onClick={toggleLanguageMenu}
                  className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                  aria-label="Change language"
                >
                  <Globe size={20} />
                </button>
                
                {isLanguageMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 z-50">
                    {availableLanguages.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`block w-full text-left px-4 py-2 text-sm ${currentLanguage === lang.code ? 'bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {isAuthenticated && (
              <div className="ml-3 relative">
                <Link to="/app/profile" className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src={user?.avatar || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'}
                      alt={user?.name}
                    />
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.name}</p>
                  </div>
                </Link>
              </div>
            )}
            
            <div className="ml-3 md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                aria-label="Main menu"
                aria-expanded="false"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAuthenticated ? (
              <>
                <Link to="/app" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/app')}`} onClick={toggleMenu}>
                  {t.dashboard}
                </Link>
                <Link to="/app/loans" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/app/loans')}`} onClick={toggleMenu}>
                  {t.loans}
                </Link>
                <Link to="/app/apply" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/app/apply')}`} onClick={toggleMenu}>
                  {t.apply}
                </Link>
                <Link to="/app/coolers" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/app/coolers')}`} onClick={toggleMenu}>
                  {t.coolers}
                </Link>
                <Link to="/app/impact" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/app/impact')}`} onClick={toggleMenu}>
                  {t.impact}
                </Link>
                <Link to="/app/marketplace" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/app/marketplace')}`} onClick={toggleMenu}>
                  {t.marketplace}
                </Link>
                <Link to="/app/profile" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/app/profile')}`} onClick={toggleMenu}>
                  {t.profile}
                </Link>
                <button 
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 dark:text-red-400"
                  onClick={() => {
                    logout();
                    toggleMenu();
                  }}
                >
                  {t.logout}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium" onClick={toggleMenu}>
                  Login
                </Link>
                <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium" onClick={toggleMenu}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;