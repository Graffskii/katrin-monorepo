import React from 'react';
import { Link } from 'react-router-dom';

// В будущем мы будем передавать сюда данные из FavoritesContext
const ProductCard = ({ product, isFavorite, onToggleFavorite }) => {
  const imageUrl = product.main_image ? `/images/${product.main_image}` : 'https://via.placeholder.com/500x700';

  return (
    <div className="group relative">
      <Link to={`/products/${product.id}`} className="block">
        <div className="aspect-[3/4] w-full overflow-hidden rounded-md bg-gray-200">
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="mt-4 flex justify-between">
          <div>
            <h3 className="text-sm text-gray-700 font-medium">
              {product.name}
            </h3>
            <p className="mt-1 text-xs text-gray-500">{product.sku}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">
              {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(product.price)}
            </p>
            {product.old_price && (
              <p className="text-xs text-gray-500 line-through">
                {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(product.old_price)}
              </p>
            )}
          </div>
        </div>
      </Link>
      
      {/* Кнопка "Избранное" */}
      <button 
        onClick={() => onToggleFavorite(product.id)}
        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/70 rounded-full backdrop-blur-sm transition hover:bg-white"
        aria-label="Добавить в избранное"
      >
        <svg className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
        </svg>
      </button>
    </div>
  );
};

export default ProductCard;