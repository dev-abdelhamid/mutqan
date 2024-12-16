import { useState, useEffect, useRef } from 'react';
import { Menu, ShoppingBag, Globe, ChevronDown, Laptop, Smartphone, Settings, Brain, Palette, TrendingUp, FolderCog, Grid, Sun, Moon } from 'lucide-react';
import { Logo } from './Logo';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../Context/ThemeContext';
import { useAppNavigation } from '../shared/useNavigation';

const MENU_ITEMS = [
  { name: 'home', href: '#home' },
  {
    name: 'services',
    href: '#services',
    subItems: [
      { name: 'web', href: '/services/web', icon: <Laptop className="w-4 h-4" /> },
      { name: 'mobile', href: '/services/mobile', icon: <Smartphone className="w-4 h-4" /> },
      { name: 'custom', href: '/services/custom', icon: <Settings className="w-4 h-4" /> },
      { name: 'ai', href: '/services/ai', icon: <Brain className="w-4 h-4" /> },
      { name: 'ui', href: '/services/ui', icon: <Palette className="w-4 h-4" /> },
      { name: 'marketing', href: '/services/marketing', icon: <TrendingUp className="w-4 h-4" /> },
      { name: 'management', href: 'website-management', icon: <FolderCog className="w-4 h-4" /> },
      { name: 'viewAll', href: '/all-services', icon: <Grid className="w-4 h-4" /> },
    ],
  },
  { name: 'gallery', href: '/Gallery' },
  { name: 'blog', href: '/blog' },
  { name: 'about', href: '#about' },
  { name: 'contact', href: '#contact' },
];

export function Header() {
  const { navigateTo } = useAppNavigation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const { i18n, t } = useTranslation();
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const { isDarkMode, toggleTheme } = useTheme();
  

  const fontClass = i18n.language === 'ar' ? 'cairo font-bold' : 'cairo font-bold';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        headerRef.current && 
        !headerRef.current.contains(event.target) ||
        (menuRef.current && !menuRef.current.contains(event.target))
      ) {
        setIsMenuOpen(false);
        setActiveSubmenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLinkClick = (href, e) => {
    e.preventDefault();
    const headerOffset = document.querySelector('header')?.offsetHeight || 0;
    const isInternalLink = href.startsWith('#');
    const isHomePage = window.location.pathname === '/';

    localStorage.removeItem('scrollTarget');
    localStorage.removeItem('headerOffset');

    if (isInternalLink) {
      if (isHomePage) {
        smoothScrollToSection(href, headerOffset);
      } else {
        localStorage.setItem('scrollTarget', href);
        localStorage.setItem('headerOffset', headerOffset.toString());
        navigateTo('/');
      }
    } else {
      navigateTo(href);
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
      });
    }
    
    closeMenus();
  };

  const smoothScrollToSection = (targetId, headerOffset) => {
    if (window.location.pathname === '/') {
      scrollToElement(targetId, headerOffset);
    } else {
      localStorage.setItem('scrollTarget', targetId);
      localStorage.setItem('headerOffset', headerOffset.toString());
      navigateTo('/');
    }
  };

  const scrollToElement = (targetId, headerOffset) => {
    const element = document.querySelector(targetId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const closeMenus = () => {
    setIsMenuOpen(false);
    setActiveSubmenu(null);
  };

  useEffect(() => {
    const scrollTarget = localStorage.getItem('scrollTarget');
    const headerOffset = parseInt(localStorage.getItem('headerOffset') || '0');
    
    if (scrollTarget) {
      const timeoutId = setTimeout(() => {
        requestAnimationFrame(() => {
          scrollToElement(scrollTarget, headerOffset);
          localStorage.removeItem('scrollTarget');
          localStorage.removeItem('headerOffset');
        });
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, []);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    setActiveSubmenu(null);
  };

  const handleSubmenuToggle = (menuName, event) => {
    event.preventDefault();
    setActiveSubmenu(activeSubmenu === menuName ? null : menuName);
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  const renderThemeToggle = () => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className={`
        
        flex items-center gap-1 px-3 py-2 text-xs
        ${isDarkMode 
          ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' 
          : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}
        rounded-xl transition-all duration-300
      `}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isDarkMode ? 'dark' : 'light'}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {isDarkMode ? (
            <Sun className="w-3 h-3 text-yellow-400" />
          ) : (
            <Moon className="w-3 h-3 text-purple-700" />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );

  const renderServiceButton = (isMobile = false) => (
    <div className={`flex ${isMobile ? 'w-full justify-center' : ''}`}>
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={
          `
          group flex items-center gap-2  
          ${isMobile ? 'px-4 py-2 ' : 'px-5 py-2 text-sm'}
          text-white font-medium
          bg-gradient-to-tr from-emerald-400 to-emerald-500
          hover:from-teal-700  hover:to-emerald-600
          rounded-xl transition-all duration-300 ${fontClass}
          relative overflow-hidden shadow-lg hover:shadow-xl
          whitespace-nowrap
        `}
      >
        <span className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500"/>
        <ShoppingBag className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'} relative z-10`} />
        <span className="relative z-10">{t('common.requestService')}</span>
      </motion.button>
    </div>
  );
  

  const renderMenuItem = (item, isMobile = false) => (
    <motion.li
      key={item.name}
      className="relative group w-full"

    >
      <Link
        to={item.href}
        onClick={(e) => {
          if (item.subItems) {
            handleSubmenuToggle(item.name, e);
          } else {
            handleLinkClick(item.href, e);
          }
        }}
        className={`
          block  text-center whitespace-nowrap px-2 py-1
          ${isDarkMode 
            ? 'text-gray-200  hover:text-white' 
            : 'text-gray-700 hover:text-gray-900'}
          rounded-2xl hover:bg-gradient-to-r 
          hover:from-emerald-600/20 hover:via-teal-400/50  hover:to-teal-500/40
          transition-all duration-300
          hover:shadow-lg hover:shadow-teal-500/20 hover:-translate-y-0.5 hover:border-1
          ${fontClass}
        `}
      >
        <div className="flex items-center justify-center gap-2">
          <span>{t(`navigation.${item.name}`)}</span>
          {item.subItems && (
            <ChevronDown 
              className={`w-4 h-4 items-start transition-transform duration-300 
              ${activeSubmenu === item.name ?  ' rotate-180' : ''}`} 
            />
          )}
        </div>
      </Link>

      {item.subItems && activeSubmenu === item.name && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={`
            ${isMobile 
              ? 'items-start mt-2 w-64 p-2 border border-gray-200' 
              : 'absolute left-0 mt-2 w-64 p-2 shadow-xl border'}
            ${isDarkMode 
              ? 'bg-gray-900 border border-gray-800' 
              : 'bg-white border border-gray-200'}
            rounded-xl 
          `}
        >
          {item.subItems.map((subItem) => (
            <motion.div
              key={subItem.name}
              whileHover={{ scale: 1.02, x: 5 }}
            >
              <Link
                to={subItem.href}
                onClick={(e) => handleLinkClick(subItem.href, e)}
                className={`
                  flex items-center gap-3 px-4 py-2 rounded-lg
                  ${isDarkMode 
                    ? 'text-gray-200 hover:text-white hover:bg-gray-800' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}
                  transition-all duration-300 ${fontClass}
                `}
              >
                <span className="text-emerald-500 items-start ">{subItem.icon}</span>
                <span>{t(`services.${subItem.name}.title`)}</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.li>
  );

  return (
    <header
      ref={headerRef}
      className={`
        fixed top-0 w-full z-50 
        ${scrolled || isMenuOpen 
          ? isDarkMode 
            ? 'bg-gray-900/95 shadow-lg backdrop-blur-lg border-b border-gray-800' 
            : 'bg-white/95 shadow-sm backdrop-blur-lg border-b border-gray-200'
          : 'bg-transparent'}
        ${fontClass}
      `}
    >
      <div className="container mx-auto flex-shrink-0   px-4">
        <div className="flex items-center justify-between  h-20 ">
          <Logo />

          <nav className="hidden lg:block">
            <ul className="flex items-center justify-center gap-8">
              {MENU_ITEMS.map((item) => renderMenuItem(item))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            {renderThemeToggle()}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleLanguage}
              className={`
                inline-flex cairo font-bold
                flex cursor-pointer content-center items-center justify-center  gap-1 px-2 py-2 text-xs 
                ${isDarkMode 
                  ? 'bg-gray-800  hover:bg-gray-700 text-gray-200' 
                  : 'bg-gray-200  hover:bg-gray-300 text-gray-800'}
                rounded-xl transition-all duration-300 ${fontClass}
              `}
            >
              <Globe size={12} viewBox='0 0 24 23' />
              <span  >{i18n.language === 'ar' ? 'EN' : 'AR'}</span>
            </motion.button>

            <div className="hidden lg:block">
              {renderServiceButton()}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleMenuToggle}
              className={`
                lg:hidden   p-1  rounded-xl
                ${isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' 
                  : 'bg-gray-200 hover:bg-gray-200 text-gray-800'}
                transition-all duration-300
              `}
            >
              <Menu className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
  {isMenuOpen && (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.1 }}
      className={`
        lg:hidden fixed top-20 left-0 right-0 z-50
        ${isDarkMode 
          ? 'bg-gray-900 border-t border-b border-gray-800' 
          : 'bg-white border-t border-b border-gray-200'}
        shadow-lg 
      `}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="container mx-auto  flex flex-col gap-3 items-center px-4 py-4">
        <nav>
          <motion.ul
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            className="flex flex-col space-y-3"
          >
            {MENU_ITEMS.map((item) => renderMenuItem(item, true))}
          </motion.ul>
        </nav>
        {renderServiceButton(true)}
      </div>
    </motion.div>
  )}
</AnimatePresence>

    </header>
  );
}

export default Header;