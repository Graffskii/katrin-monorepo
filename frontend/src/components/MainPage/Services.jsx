import React from 'react';

const Services = () => {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-playfair font-bold text-center text-gray-900 mb-12">Наши услуги</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 bg-secondary rounded-lg">
            <div className="w-12 h-12 flex items-center justify-center text-primary text-2xl mb-6">
              <i className="ri-heart-line"></i>
            </div>
            <h3 className="text-xl font-playfair font-bold text-gray-900 mb-4">Примерка по записи</h3>
            <p className="text-gray-600 mb-6">Вы сможете примерить любые понравившиеся Вам платья без спешки и суеты. </p>
            <p className="text-primary font-semibold mb-4">Вы обязательно найдете платье по вкусу</p>
          </div>
          <div className="p-8 bg-secondary rounded-lg">
            <div className="w-12 h-12 flex items-center justify-center text-primary text-2xl mb-6">
              <i className="ri-scissors-line"></i>
            </div>
            <h3 className="text-xl font-playfair font-bold text-gray-900 mb-4">Пошив платья</h3>
            <p className="text-gray-600 mb-6">Профессиональный портной сможет пошить платье идеально под Вашу фигуру и рост.</p>
            <p className="text-primary font-semibold mb-4">Платье будет на Вас идеальным</p>
          </div>
          <div className="p-8 bg-secondary rounded-lg">
            <div className="w-12 h-12 flex items-center justify-center text-primary text-2xl mb-6">
              <i className="ri-percent-line"></i>
            </div>
            <h3 className="text-xl font-playfair font-bold text-gray-900 mb-4">Рассрочка без %</h3>
            <p className="text-gray-600 mb-6">Выгодные условия для оформления рассрочки на любое платье, без процентов и переплат.</p>
            <p className="text-primary font-semibold mb-4">Идеальная возможность купить платье</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
