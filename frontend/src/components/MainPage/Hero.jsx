import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{backgroundImage: `url('../../../images/mainpage/hero.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-transparent"></div>
      <div className="relative z-10 px-4 w-full max-w-4xl mx-auto flex flex-col items-center text-center mt-16">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-playfair font-bold text-white mb-6 leading-tight">
          Ваша Идеальная Свадьба Начинается Здесь
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl">
          Ощутите роскошь и элегантность в нашем свадебном салоне. Где мечты становятся реальностью.
        </p>
        <Link
          to="/appointment" 
          className="bg-white text-primary px-8 py-4 md:px-10 md:py-5 rounded-md font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg inline-block"
        >
          Записаться на примерку
        </Link>
      </div>
    </section>
  );
};

export default Hero;
