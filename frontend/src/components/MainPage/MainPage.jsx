import React, { useState, useEffect } from 'react';
import Header from './Header';
import Hero from './Hero';
import About from './About';
import Gallery from './Gallery';
import Services from './Services';
import Contact from './Contact';
import Footer from './Footer';

const MainPage = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  
  useEffect(() => {
    // Загрузка данных галереи при монтировании компонента
    const fetchGallery = async () => {
      try {
        const response = await fetch('/api/');
        if (response.ok) {
          const data = await response.json()
          console.log(data)
          setGalleryItems(data.gallery);
        }
      } catch (error) {
        console.error('Ошибка загрузки галереи:', error);
      }
    };
    
    fetchGallery();
  }, []);
  
  return (
    <>
      <Header />
      <Hero />
      <About />
      <Gallery galleryItems={galleryItems} />
      <Services />
      <Contact />
      <Footer />
    </>
  );
};

export default MainPage;