import React from 'react';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center"
      style={{backgroundImage: `url('https://public.readdy.ai/ai/img_res/04912d24988877ceaabfb73c79c367c9.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-transparent"></div>
      <div className="relative max-w-7xl mx-auto px-4 py-32">
        <div className="max-w-2xl">
          <h1 className="text-6xl font-playfair font-bold text-white mb-6">Ваша Идеальная Свадьба Начинается Здесь</h1>
          <p className="text-xl text-white/90 mb-8">Ощутите роскошь и элегантность в нашем свадебном салоне. Где
            мечты становятся реальностью.</p>
          <a
            href="#contact" className="bg-white text-primary px-8 py-4 rounded-button font-semibold hover:bg-primary hover:text-white transition-all cursor-pointer">Записаться на примерку</a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
