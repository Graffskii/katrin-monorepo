import React from 'react';
import { Link } from 'react-router-dom';

// Этот компонент-карточка остается почти без изменений.
// Он будет использоваться для отображения и категорий, и подкатегорий.
const GridCard = ({ item, linkTo }) => {
    const imageUrl = item.cover_image ? `/images/${item.cover_image}` : 'https://via.placeholder.com/600x800';

    return (
        <Link to={linkTo} className="relative block h-auto aspect-[10/16] group overflow-hidden rounded-md">
            <img 
                src={imageUrl} 
                alt={item.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="absolute inset-0 flex items-center justify-center text-center text-white p-4">
                <h3 className="text-4xl text-white font-playfair font-bold tracking-wider border-y-2 py-2">{item.name}</h3>
            </div>
        </Link>
    );
};

// --- ОСНОВНОЙ КОМПОНЕНТ СЕТКИ ---
// Мы сделаем его универсальным, чтобы он мог работать и с категориями, и с подкатегориями.
const CategoriesGrid = ({ categories }) => {
    if (!categories || categories.length === 0) return null;

    return (
        <div className="max-w-screen-2xl mx-auto px-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map(category => (
                    <GridCard 
                        key={category.id} 
                        item={category} 
                        linkTo={`/catalog/${category.slug}`} 
                    />
                ))}
            </div>
        </div>
    );
};

export default CategoriesGrid;