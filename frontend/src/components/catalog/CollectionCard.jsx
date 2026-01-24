import React from 'react';
import { Link } from 'react-router-dom';

const CollectionCard = ({ collection }) => {
  // Заглушка, если изображение не загрузилось
  const imageUrl = collection.cover_image ? `/images/${collection.cover_image}` : 'https://via.placeholder.com/600x800';

  return (
    <Link to={`/collections/${collection.id}`} className="group relative block w-full h-96 rounded-lg overflow-hidden shadow-lg">
      {/* Фоновое изображение */}
      <img 
        src={imageUrl} 
        alt={collection.name} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      {/* Градиент для читаемости текста */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
      
      {/* Текст */}
      <div className="absolute bottom-0 left-0 p-6 text-white">
        <h2 className="text-3xl font-playfair font-bold mb-2">{collection.name}</h2>
        <p className="font-poppins opacity-90">{collection.description}</p>
        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="font-semibold">Смотреть коллекцию →</span>
        </div>
      </div>
    </Link>
  );
};

export default CollectionCard;