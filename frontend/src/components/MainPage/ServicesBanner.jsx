import React from 'react';
import { Link } from 'react-router-dom';

const ServicesBanner = () => {
  return (
    <section className="bg-secondary py-16 text-gray-600 font-light leading-relaxed space-y-6
    [&_h2]:text-4xl [&_h2]:font-playfair [&_h2]:text-center [&_h2]:mb-8
    [&_h3]:text-2xl [&_h3]:font-playfair [&_h3]:mt-10
    [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-2
    [&_strong]:font-semibold [&_strong]:text-gray-700">
      <div className="max-w-screen-xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-playfair font-bold text-gray-800">Дополнительные услуги</h2>
        <p className="lg:text-2xl text-gray-600 mt-4 max-w-2xl mx-auto">
          Мы предлагаем полный спектр услуг, чтобы сделать подготовку к вашему событию безупречной — от подгонки платья до хранения.
        </p>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Карточка услуги */}
          <div className="text-center">
            <div className="text-5xl text-primary mb-4 flex justify-center"><i className="ri-scissors-2-line"></i></div>
            <h3 className="text-xl font-playfair font-semibold text-gray-800">Примерка по записи</h3>
          </div>
          {/* Карточка услуги */}
          <div className="text-center">
            <div className="text-5xl text-primary mb-4 flex justify-center"><i className="ri-heart-line"></i></div>
            <h3 className="text-xl font-playfair font-semibold text-gray-800">Пошив платья</h3>
          </div>
          {/* Карточка услуги */}
          <div className="text-center">
            <div className="text-5xl text-primary mb-4 flex justify-center"><i className="ri-percent-line"></i></div>
            <h3 className="text-xl font-playfair font-semibold text-gray-800">Рассрочка без %</h3>
          </div>
        </div>
        <Link 
          to="/services" 
          className="mt-12 inline-block bg-white text-primary px-8 py-3 rounded-md font-semibold border border-primary hover:bg-primary hover:text-white transition-all"
        >
          Узнать больше
        </Link>
      </div>
    </section>
  );
};

export default ServicesBanner;