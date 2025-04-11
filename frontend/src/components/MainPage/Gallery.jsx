import React, { useState } from 'react';

const Gallery = ({ galleryItems }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (category, index) => {
    setCurrentCategory(category);
    setCurrentIndex(index);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = '';
  };

  const navigate = (direction) => {
    const items = galleryItems.filter(item => item.category === currentCategory);
    console.log(items)
    setCurrentIndex((prevIndex) => {
        let newIndex = prevIndex + direction;
  
        // Циклически возвращаемся в начало или конец
        if (newIndex >= items.length) newIndex = 0; // если индекс больше длины, возвращаем в начало
        if (newIndex < 0) newIndex = items.length - 1; // если индекс меньше 0, переходим в конец
  
        return newIndex;
      });
  };

  // Группировка по категориям для показа превью
  const categories = [
    { name: 'Wedding Dresses', title: 'Свадебные платья', description: 'Откройте для себя роскошный выбор' },
    { name: 'Evening Dresses', title: 'Вечерние платья', description: 'Найдите себе идеальное платье' },
    { name: 'Decorations', title: 'Декорации', description: 'Сделайте Ваш день идеальным' }
  ];

  // Для модального окна
  const currentItems = galleryItems.filter(item => item.category === currentCategory);
  const currentItem = currentItems[currentIndex];

  return (
    <section id="gallery" className="py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-playfair font-bold text-center text-gray-900 mb-12">Наша галерея</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div 
              key={category.name}
              className="group relative h-[400px] rounded-lg overflow-hidden cursor-pointer"
              onClick={() => openModal(category.name, 0)}
            >
              <img 
                src={index === 0 
                  ? "https://public.readdy.ai/ai/img_res/7d9b82151715c1916de743be0829955a.jpg" 
                  : index === 1 
                    ? "https://public.readdy.ai/ai/img_res/d051af50b0e8d83b578698a6ba092b45.jpg" 
                    : "https://public.readdy.ai/ai/img_res/e897628c552a50901d8dacbb8637d25a.jpg"}
                className="absolute inset-0 w-full h-full object-cover" 
                alt={category.title} 
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition-all"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform">
                <h3 className="text-xl font-playfair font-bold mb-2">{category.title}</h3>
                <p className="text-sm">{category.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Модальное окно */}
      {modalOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="relative bg-white rounded-lg max-w-4xl w-full">
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
            <div className="relative h-[70vh]">
              {currentItem && (
                <img 
                  className="absolute inset-0 w-full h-full object-contain" 
                  src={currentItem.filename.startsWith('/') ? currentItem.filename : `/images/${currentItem.filename}`} 
                  alt={currentItem.caption} 
                />
              )}
              <button 
                onClick={() => navigate(-1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-gray-700 hover:bg-white"
              >
                <i className="ri-arrow-left-s-line text-2xl"></i>
              </button>
              <button 
                onClick={() => navigate(1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-gray-700 hover:bg-white"
              >
                <i className="ri-arrow-right-s-line text-2xl"></i>
              </button>
            </div>
            <div className="p-6 bg-white rounded-b-lg">
              <h3 className="text-2xl font-playfair font-bold text-gray-900 mb-2">
                {currentItem ? currentItem.caption : ''}
              </h3>
              <p className="text-gray-600">
                {currentItem ? currentItem.caption : ''}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
