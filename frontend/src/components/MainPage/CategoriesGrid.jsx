import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => (
  <Link to={`/catalog/${category.slug}`} className="relative block h-80 group overflow-hidden rounded-md">
    <img 
      src={`/images/${category.cover_image}`} 
      alt={category.name}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
    <div className="absolute inset-x-0 bottom-8 text-center text-white">
      <h3 className="text-3xl font-playfair font-bold tracking-wider">{category.name}</h3>
    </div>
  </Link>
);

const CategoriesGrid = ({ categories }) => {
  if (!categories || categories.length === 0) return null;

  const mainCategories = categories.slice(0, 2); // Первые две - большие
  const otherCategories = categories.slice(2); // Остальные - поменьше

  return (
    <section className="py-24 bg-secondary">
      <div className="max-w-screen-2xl mx-auto px-4">
        {/* --- НОВАЯ ВЕРСТКА СЕТКИ --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Главные категории, занимают 2/3 ширины на больших экранах */}
          {mainCategories.map(cat => (
              <CategoryCard key={cat.id} category={cat} className="lg:col-span-1 aspect-[3/9]" />
          ))}

          {/* Дополнительные категории */}
          {otherCategories.map(cat => (
              <CategoryCard key={cat.id} category={cat} className="lg:col-span-1 aspect-[3/9]" />
          ))}

          {/* Пример, если нужно сделать одну категорию шире других */}
          {/* <CategoryCard category={categories[0]} className="lg:col-span-2 aspect-[16/9]" /> */}

        </div>
      </div>
    </section>
  );
};

export default CategoriesGrid;