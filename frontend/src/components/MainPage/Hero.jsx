import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const heroImage = "/images/mainpage/hero3.jpg"; // Ваше изображение

  return (
    // min-h-screen гарантирует, что блок займет всю высоту экрана
    // bg-[#Fdfbf9] - это цвет фона левой части (почти белый, теплый). Измените HEX-код под вашу гамму.
    <section className="relative w-full min-h-screen flex flex-col lg:flex-row bg-transparent lg:bg-[#FFF5F5]">
      <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-black/60 to-transparent"></div>

      <div className="absolute inset-0 lg:hidden -z-10">
        <img 
          src={heroImage} 
          alt="Свадебные платья" 
          className="w-full h-full object-cover object-top"
        />
      </div>
      
      {/* --- ЛЕВАЯ ЧАСТЬ: ТЕКСТ (занимает 50% ширины на ПК) --- */}
      <div className="w-full lg:w-2/5 flex items-center justify-center pt-32 pb-16 px-4 lg:px-12 xl:px-24 min-h-screen lg:min-h-0 bg-white/70 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none">
        <div className="max-w-xl text-center lg:text-left">
          <p className="text-sm md:text-base text-primary font-semibold tracking-widest uppercase mb-6">
            От 5000 до 150000 руб.
          </p>
          <h1 className="text-5xl md:text-6xl xl:text-7xl font-playfair font-bold text-gray-900 mb-8 leading-tight">
            Свадебные <br className="hidden lg:block"/> платья в Томске
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-12">
            Свадебный салон Katrin... <br/>
            Любовь с первой примерки! 🤍
          </p>
          <Link
            to="/appointment" 
            className="bg-gray-200 text-gray-800 px-10 py-5 rounded-full font-semibold text-lg hover:bg-gray-300 transition-colors inline-block"
          >
            Записаться на примерку
          </Link>
        </div>
      </div>

      {/* --- ПРАВАЯ ЧАСТЬ: ИЗОБРАЖЕНИЕ (занимает 50% ширины на ПК) --- */}
      {/* На мобильных она будет либо скрыта, либо под текстом. Сделаем ее скрытой на мобильных, как на референсе MARY, чтобы мобильная версия была чистой. */}
      <div className="hidden lg:block w-3/5 relative">
        <img 
          src={heroImage} 
          alt="Свадебные платья Katrin" 
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
      </div>
      <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-black/60 to-transparent"></div>
    </section>
  );
};

export default Hero;