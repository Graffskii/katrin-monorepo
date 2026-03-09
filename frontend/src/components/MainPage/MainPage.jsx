import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer'; // Путь может быть другим, проверьте
import Hero from './Hero';
import About from './About';
import Services from './Services';
import Contact from './Contact';
import CategoriesGrid from './CategoriesGrid';
import SeoText from '../SeoText';

import ServicesBanner from './ServicesBanner';

const MainPage = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Загружаем всю структуру каталога для отображения категорий на главной
    const fetchCatalogData = async () => {
      try {
        const response = await fetch('/api/catalog/structure');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Ошибка загрузки структуры каталога:', error);
      }
    };

    fetchCatalogData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header variant="transparent" />
      <main className="flex-grow">
        <Hero />
        <div className="mt-16"> {/* <-- ИЗМЕНЕНИЕ ЗДЕСЬ. Можете поиграть со значением (mt-12, mt-20) */}
          <CategoriesGrid categories={categories} />
        </div>
        <SeoText>
            <h2>Салон свадебных и вечерних платьев «Katrin»</h2>
            <p>
                У вас впереди свадьба, выпускной или другое вечернее мероприятие? Мы приглашаем вас записаться на примерку в наш салон, где опытные консультанты с радостью помогут найти идеальный наряд для любого случая. Они учтут ваши пожелания и дадут профессиональные советы по созданию ярких и запоминающихся образов.
            </p>
            <h3>В нашем каталоге представлены:</h3>
            <ul>
                <li><strong>Свадебные платья:</strong> Элегантные модели А-силуэта, изящные платья «русалки», классические платья с многослойными юбками и многое другое.</li>
                <li><strong>Вечерние платья:</strong> Торжественные платья в длине макси, очаровательные платья-миди, эффектные модели с пышными юбками и корсетами.</li>
                <li><strong>Аксессуары:</strong> Фата, шубки и пальто для создания эффектных и завершённых образов.</li>
            </ul>
            <p>
                Почувствуйте себя самой красивой в свой особенный день. Запишитесь на примерку по телефону или через наш сайт. Мы ждём вас и готовы сделать всё возможное, чтобы ваше пребывание в свадебном салоне было максимально комфортным и приятным!
            </p>
        </SeoText>
        <div className="mt-16 
          text-gray-600 font-light space-y-6
          [&_h2]:text-4xl [&_h2]:font-playfair [&_h2]:text-center [&_h2]:mb-8
          [&_h3]:text-2xl [&_h3]:font-playfair [&_h3]:mt-10
          [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-2
          [&_strong]:font-semibold [&_strong]:text-gray-700"> {/* <-- ИЗМЕНЕНИЕ ЗДЕСЬ */}
          <About />
          <Services />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainPage;