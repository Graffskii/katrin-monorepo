import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 py-16">
      <div className="max-w-screen-2xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Адреса */}
        <div className="">
          <div>
            <h4 className="font-bold text-gray-800">КАТРИН ТОМСК</h4>
            <p className="text-sm">ПРОСПЕКТ ЛЕНИНА 95</p>
            <p className="text-sm">ТЕЛ. 226-34-85</p>
            <Link to="/contacts" className="text-sm text-primary hover:underline">Смотреть на карте</Link>
          </div>
        </div>

        {/* Каталог */}
        <div>
          <h4 className="font-bold mb-4 text-gray-800">КАТАЛОГ</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/catalog/wedding-dresses" className="hover:text-primary">Свадебные платья</Link></li>
            <li><Link to="/catalog/evening-dresses" className="hover:text-primary">Вечерние платья</Link></li>
            <li><Link to="/catalog/accessories" className="hover:text-primary">Аксессуары</Link></li>
            {/* ... другие ссылки на категории */}
          </ul>
        </div>
        
        {/* Информация */}
        <div>
          <h4 className="font-bold mb-4 text-gray-800">ИНФОРМАЦИЯ</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/services" className="hover:text-primary">Дополнительные услуги</Link></li>
            <li><Link to="/reviews" className="hover:text-primary">Отзывы</Link></li>
          </ul>
        </div>
        
        {/* Соцсети */}
        <div className="flex flex-col items-start">
            <h4 className="font-bold mb-4 text-gray-800">СОЦИАЛЬНЫЕ СЕТИ</h4>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/katrin_salon_tomsk/" className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-gray-500 hover:bg-gray-200 border"><i className="ri-instagram-line"></i></a>
              <a href="https://vk.com/club66770999" className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-gray-500 hover:bg-gray-200 border"><i className="ri-vk-line"></i></a>
            </div>
        </div>
      </div>
      <div className="max-w-screen-2xl mx-auto px-4 mt-12 text-center text-xs text-gray-500 border-t pt-8">
        © 2025 Katrin Bridal Salon. Все права защищены.
      </div>
    </footer>
  );
};

export default Footer;