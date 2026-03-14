import React, { useState } from 'react';
import CategoryList from './CategoryList';
// Подключим их позже:
import SubcategoryList from './SubcategoryList';
import ProductManager from './ProductManager';

const CatalogManager = () => {
    // Состояние навигации. 
    // null = показываем категории. 
    // { id, name } = показываем подкатегории этой категории и т.д.
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);

    // Хлебные крошки для админки
    const renderBreadcrumbs = () => (
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6 bg-white p-4 rounded-lg shadow-sm">
            <button onClick={() => { setSelectedCategory(null); setSelectedSubcategory(null); }} className="hover:text-primary font-medium">Каталог</button>
            
            {selectedCategory && (
                <>
                    <span>/</span>
                    <button onClick={() => setSelectedSubcategory(null)} className={`hover:text-primary font-medium ${!selectedSubcategory ? 'text-primary' : ''}`}>
                        {selectedCategory.name}
                    </button>
                </>
            )}
            
            {selectedSubcategory && (
                <>
                    <span>/</span>
                    <span className="text-primary font-medium">{selectedSubcategory.name}</span>
                </>
            )}
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto">
            {renderBreadcrumbs()}

            {/* Логика отображения: */}
            {!selectedCategory && (
                <CategoryList onSelectCategory={(cat) => setSelectedCategory(cat)} />
            )}

            {selectedCategory && !selectedSubcategory && (
                <SubcategoryList
                    categoryId={selectedCategory.id}
                    onSelectSubcategory={(sub) => setSelectedSubcategory(sub)}
                />
            )}

            {selectedSubcategory && (
                <ProductManager subcategoryId={selectedSubcategory.id} />
            )}
        </div>
    );
};

export default CatalogManager;