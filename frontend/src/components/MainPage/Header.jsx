import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
// Предположим, у вас есть иконка лупы в виде SVG или компонента
// Если нет, можно временно использовать текст или emoji '🔍'
// import { SearchIcon } from './icons'; 

const Header = ({ variant }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparentMode = variant === 'transparent' && !isScrolled;

  const headerClasses = `fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 shadow-md backdrop-blur-sm' : 'bg-transparent'}`;
  const textColorClass = isTransparentMode ? 'text-white' : 'text-gray-700';
  const navLinkClasses = `${textColorClass} hover:text-primary transition-colors duration-300 pb-2 border-b-2 border-transparent`;
  const activeNavLinkClasses = `!text-primary border-primary`; // ! - important, чтобы перебить text-white


  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 shadow-md backdrop-blur-sm' : 'bg-transparent'}`}>
      {/* Верхняя информационная панель */}
      <div className="bg-gray-100 text-gray-600 text-sm hidden md:block">
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

      {/* Основная навигационная панель */}
      <div className="max-w-screen-2xl mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium uppercase tracking-wider">
            <NavLink to="/catalog/wedding-dresses" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Свадебные платья</NavLink>
            <NavLink to="/catalog/evening-dresses" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Вечерние платья</NavLink>
            <NavLink to="/catalog" end className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Каталог</NavLink>
            <NavLink to="/services" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Услуги</NavLink>
          </nav>

          <div className="absolute left-1/2 -translate-x-1/2">
            <Link to="/" className={`text-4xl font-['Pacifico'] transition-colors ${isTransparentMode ? 'text-white' : 'text-primary'}`}>
              Katrin
            </Link>
          </div>
          
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium uppercase tracking-wider">
            <NavLink to="/reviews" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Отзывы</NavLink>
            <NavLink to="/contacts" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Контакты</NavLink>
            <Link to="/appointment" className="bg-primary/10 text-primary px-4 py-2 rounded-md hover:bg-primary/20 transition-colors">
              Записаться на примерку
            </Link>
            <button className="w-10 h-10 flex items-center justify-center border-2 rounded-full hover:border-primary transition-colors">
              {/* <SearchIcon /> */} 🔍
            </button>
          </div>

          {/* TODO: Добавить мобильное меню (бургер) */}
          <div className="lg:hidden">
            <button>☰</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;