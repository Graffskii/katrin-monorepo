import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
// Предположим, у вас есть иконка лупы в виде SVG или компонента
// Если нет, можно временно использовать текст или emoji '🔍'
// import { SearchIcon } from './icons'; 

const Header = ({ variant }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparentMode = variant === 'transparent' && !isScrolled;

  const headerClasses = `fixed w-full z-50 transition-all duration-300 ${isScrolled || isMenuOpen ? 'bg-white/95 shadow-md backdrop-blur-sm' : 'bg-transparent'}`;
  const textColorClass = isTransparentMode && !isMenuOpen ? 'text-white' : 'text-gray-700';
  const navLinkClasses = `${textColorClass} hover:text-primary transition-colors duration-300 py-2 border-b-2 border-transparent`;
  const activeNavLinkClasses = `!text-primary border-primary`;

  const MobileNavLink = ({ to, children }) => (
    <NavLink to={to} onClick={() => setIsMenuOpen(false)} className="block py-3 text-lg text-gray-700 hover:text-primary">
      {children}
    </NavLink>
  );

  return (
    <>
      <header className={headerClasses}>
        {/* Верхняя панель (скрыта на мобильных) */}
        <div className="bg-gray-100 text-gray-600 text-base hidden md:block">
          <div className="max-w-screen-2xl mx-auto px-4 py-2 flex justify-between items-center">
            <div className="flex gap-8">
              <div>
                <p>Г. ТОМСК, ПРОСПЕКТ ЛЕНИНА 95</p>
                <p>+7 (383) 226-34-85</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a href="#" className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-gray-500 hover:bg-gray-200"><i className="ri-instagram-line"></i></a>
              <a href="#" className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-gray-500 hover:bg-gray-200"><i className="ri-vk-line"></i></a>
              <a href="#" className="w-8 h-8 flex items-center justify-center bg-white rounded-full text-gray-500 hover:bg-gray-200"><i className="ri-whatsapp-line"></i></a>
            </div>
          </div>
        </div>

        {/* Основная навигация */}
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Левая часть (скрыта на больших экранах) */}
            <div className="lg:hidden">
              <Link to="/appointment" className={`text-sm bg-primary/10 text-primary px-3 py-2 rounded-md transition-colors ${isTransparentMode && !isMenuOpen ? 'text-white' : 'text-primary'}`}>Запись</Link>
            </div>

            {/* Логотип */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <Link to="/" className={`text-5xl font-['Pacifico'] transition-colors ${isTransparentMode && !isMenuOpen ? 'text-white' : 'text-primary'}`}>Katrin</Link>
            </div>

            {/* Навигация для десктопа */}
            <nav className="hidden lg:flex items-center gap-6 text-lg font-light">
              <NavLink to="/catalog/wedding-dresses" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Свадебные платья</NavLink>
              <NavLink to="/catalog/evening-dresses" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Вечерние платья</NavLink>
              <NavLink to="/catalog" end className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Каталог</NavLink>
              <NavLink to="/services" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Услуги</NavLink>
            </nav>
            <div className="hidden lg:flex items-center gap-6 text-lg font-light">
              <NavLink to="/reviews" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Отзывы</NavLink>
              <NavLink to="/contacts" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Контакты</NavLink>
              <Link to="/appointment" className="bg-primary/10 text-primary font-semibold px-4 py-2 rounded-md hover:bg-primary/20 transition-colors">
                Записаться на примерку
              </Link>
              <button className="w-10 h-10 flex items-center justify-center border-2 rounded-full hover:border-primary transition-colors">
                {/* <SearchIcon /> */} 🔍
              </button>
            </div>

            {/* Бургер-меню (правая часть) */}
            <div className="lg:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="z-50 relative w-8 h-8">
                <span className={`block w-6 h-0.5 bg-current transform transition duration-300 ease-in-out ${isMenuOpen ? 'rotate-45' : '-translate-y-1.5'} transition-colors ${isTransparentMode && !isMenuOpen ? 'text-white' : 'text-primary'}`}></span>
                <span className={`block w-6 h-0.5 bg-current mt-1 transform transition duration-300 ease-in-out ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''} transition-colors ${isTransparentMode && !isMenuOpen ? 'text-white' : 'text-primary'}`}></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Выезжающая панель мобильного меню */}
      <div className={`fixed inset-0 z-40 text-lg font-light bg-white/95 backdrop-blur-sm transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <nav className="mt-28 px-8 space-y-4">
          <MobileNavLink to="/catalog/wedding-dresses">Свадебные платья</MobileNavLink>
          <MobileNavLink to="/catalog/evening-dresses">Вечерние платья</MobileNavLink>
          <MobileNavLink to="/catalog">Каталог</MobileNavLink>
          <MobileNavLink to="/services">Услуги</MobileNavLink>
          <MobileNavLink to="/reviews">Отзывы</MobileNavLink>
          <MobileNavLink to="/contacts">Контакты</MobileNavLink>
          <MobileNavLink to="/appointment">Записаться на примерку</MobileNavLink>
        </nav>
      </div>
    </>
  );
};

export default Header;