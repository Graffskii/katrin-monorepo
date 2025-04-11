import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <a href="#" className="text-3xl font-['Pacifico'] text-white mb-4 block">Katrin</a>
            <p className="text-white-500/80">Исполняем мечты с 2010</p>
          </div>
          <div>
            <h4 className="font-playfair font-bold mb-4">Ссылки</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-white/80 hover:text-white">Главная</a></li>
              <li><a href="#about" className="text-white/80 hover:text-white">О нас</a></li>
              <li><a href="#gallery" className="text-white/80 hover:text-white">Галерея</a></li>
              <li><a href="#services" className="text-white/80 hover:text-white">Услуги</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-playfair font-bold mb-4">Время работы</h4>
            <ul className="space-y-2 text-white/80">
              <li>Понедельник - Суббота: 10:00 - 19:00</li>
              <li>Воскресенье: 11:00 - 18:00</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/80">© 2025 Katrin. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="https://www.instagram.com/katrin_salon_tomsk/" className="text-white/80 hover:text-white">
              <i className="ri-instagram-line"></i>
            </a>
            <a href="https://vk.com/club66770999" className="text-white/80 hover:text-white">
              <i className="ri-vk-line"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;