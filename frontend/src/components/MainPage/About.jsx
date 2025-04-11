import React from 'react';

const About = () => {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[600px] rounded-lg overflow-hidden">
            <img src="https://public.readdy.ai/ai/img_res/054a63c34db8a812adecabd12837183b.jpg"
              className="absolute inset-0 w-full h-full object-cover" alt="Salon Interior" />
          </div>
          <div>
            <h2 className="text-4xl font-playfair font-bold text-gray-900 mb-6">Наследие любви и элегантности</h2>
            <p className="text-gray-600 mb-6">С 2010 года мы создаем незабываемые свадебные впечатления для
              невест, которые ищут совершенства. Наша тщательно подобранная коллекция включает эксклюзивные модели от
              всемирно известных дизайнеров, гарантируя, что каждая невеста найдет платье своей мечты.</p>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="p-6 bg-secondary rounded-lg">
                <h3 className="text-2xl font-playfair font-bold text-primary mb-2">15+</h3>
                <p className="text-gray-600">Лет Опыта</p>
              </div>
              <div className="p-6 bg-secondary rounded-lg">
                <h3 className="text-2xl font-playfair font-bold text-primary mb-2">5000+</h3>
                <p className="text-gray-600">Счастливых Невест</p>
              </div>
              <div className="p-6 bg-secondary rounded-lg">
                <h3 className="text-2xl font-playfair font-bold text-primary mb-2">300+</h3>
                <p className="text-gray-600">Уникальных Дизайнов</p>
              </div>
              <div className="p-6 bg-secondary rounded-lg">
                <h3 className="text-2xl font-playfair font-bold text-primary mb-2">100%</h3>
                <p className="text-gray-600">Удовлетворения</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;