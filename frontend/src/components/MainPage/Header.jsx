import React from 'react';

const Header = () => {
  return (
    <header className="fixed w-full bg-white/90 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <a href="#" className="text-3xl font-['Pacifico'] text-primary">Katrin</a>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#home" className="text-gray-700 hover:text-primary">Главная</a>
          <a href="#about" className="text-gray-700 hover:text-primary">О нас</a>
          <a href="#gallery" className="text-gray-700 hover:text-primary">Галерея</a>
          <a href="#services" className="text-gray-700 hover:text-primary">Услуги</a>
          <a href="#contact" className="text-gray-700 hover:text-primary">Контакты</a>
        </nav>
        <div className="flex items-center space-x-4">
          <a href="https://www.instagram.com/katrin_salon_tomsk/" className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-primary">
            <i className="ri-instagram-line"></i>
          </a>
          <a href="https://vk.com/club66770999" className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-primary">
            <i className="ri-vk-line"></i>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
