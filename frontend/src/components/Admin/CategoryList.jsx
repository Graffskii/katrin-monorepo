import React, { useState, useEffect } from 'react';

const CategoryList = ({ onSelectCategory }) => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/admin/categories', { credentials: 'include' });
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div>Загрузка категорий...</div>;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Главные категории</h2>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {categories.map(cat => (
                    <div key={cat.id} className="border rounded-lg overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
                        <div className="h-40 bg-gray-200 relative">
                            {cat.cover_image ? (
                                <img src={`/images/${cat.cover_image}`} alt={cat.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">Нет фото</div>
                            )}
                        </div>
                        <div className="p-4 flex-grow flex flex-col">
                            <h3 className="font-bold text-lg mb-1">{cat.name}</h3>
                            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{cat.slug}</p>
                            
                            <div className="mt-auto grid grid-cols-2 gap-2">
                                <button 
                                    onClick={() => onSelectCategory(cat)}
                                    className="bg-primary/10 text-primary py-2 rounded text-sm font-semibold hover:bg-primary hover:text-white transition-colors"
                                >
                                    Открыть
                                </button>
                                <button className="bg-gray-100 text-gray-700 py-2 rounded text-sm font-semibold hover:bg-gray-200 transition-colors">
                                    Изменить
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryList;