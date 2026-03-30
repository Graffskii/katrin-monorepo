import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
    const [searchParams, setSearchParams] = useSearchParams();

    // Получаем ID из URL
    const categoryId = searchParams.get('categoryId');
    const subcategoryId = searchParams.get('subcategoryId');
    
    // Перейти в подкатегории
    const handleSelectCategory = (cat) => {
        setSearchParams({ categoryId: cat.id, categoryName: cat.name });
    };

    // Перейти в товары
    const handleSelectSubcategory = (sub) => {
        setSearchParams({ 
            categoryId: categoryId, 
            categoryName: searchParams.get('categoryName'),
            subcategoryId: sub.id,
            subcategoryName: sub.name
        });
    };

    // Вернуться в корень (Каталог)
    const goBackToCatalog = () => {
        setSearchParams({}); 
    };

    // Вернуться в список подкатегорий
    const goBackToCategory = () => {
        setSearchParams({ 
            categoryId: categoryId, 
            categoryName: searchParams.get('categoryName') 
        });
    };

    // Хлебные крошки для админки
    const renderBreadcrumbs = () => (
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6 bg-white p-4 rounded-lg shadow-sm">
            <button onClick={goBackToCatalog} className="hover:text-primary font-medium">Каталог</button>
            
            {categoryId && (
                <>
                    <span>/</span>
                    <button onClick={goBackToCategory} className={`hover:text-primary font-medium ${!subcategoryId ? 'text-primary' : ''}`}>
                        {searchParams.get('categoryName') || 'Категория'}
                    </button>
                </>
            )}
            
            {subcategoryId && (
                <>
                    <span>/</span>
                    <span className="text-primary font-medium">
                        {searchParams.get('subcategoryName') || 'Подкатегория'}
                    </span>
                </>
            )}
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto">
            {renderBreadcrumbs()}

            {!categoryId && (
                <CategoryList onSelectCategory={handleSelectCategory} />
            )}

            {categoryId && !subcategoryId && (
                <SubcategoryList 
                    categoryId={categoryId} 
                    onSelectSubcategory={handleSelectSubcategory} 
                />
            )}

            {categoryId && subcategoryId && (
                 <ProductManager subcategoryId={subcategoryId} />
            )}
        </div>
    );
};

export default CatalogManager;