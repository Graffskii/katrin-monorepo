import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer'; // Путь может быть другим, проверьте
import Hero from './Hero';
import About from './About';
import Services from './Services';
import Contact from './Contact';
import CategoriesGrid from './CategoriesGrid';

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
        <div className="mt-16"> {/* <-- ИЗМЕНЕНИЕ ЗДЕСЬ */}
          <About />
        </div>
        <Services />
        <Contact />
        {/* Убрали старую галерею и контакты, т.к. они есть в футере/хедере */}
      </main>
      <Footer />
    </div>
  );
};

export default MainPage;