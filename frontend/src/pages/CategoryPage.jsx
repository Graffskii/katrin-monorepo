import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/MainPage/Header';
import Footer from '../components/MainPage/Footer';

const SubCategoryCard = ({ subcategory, parentSlug }) => (
    <Link to={`/catalog/${parentSlug}/${subcategory.slug}`} className="relative block h-96 group overflow-hidden rounded-md">
        <img 
            src={`/images/${subcategory.cover_image}`} 
            alt={subcategory.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 flex items-center justify-center text-center text-white p-4">
            <h3 className="text-3xl font-playfair font-bold tracking-wider border-y-2 py-2">{subcategory.name}</h3>
        </div>
    </Link>
);


const CategoryPage = () => {
    const { categorySlug } = useParams();
    const [category, setCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategoryData = async () => {
            setIsLoading(true);
            try {
                // Мы получаем всю структуру, а затем находим нужную категорию по slug
                const response = await fetch('/api/catalog/structure');
                const allCategories = await response.json();
                const currentCategory = allCategories.find(cat => cat.slug === categorySlug);
                setCategory(currentCategory);
            } catch (error) {
                console.error("Ошибка загрузки категории:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategoryData();
    }, [categorySlug]);

    if (isLoading) return <div className="text-center py-40">Загрузка...</div>;
    if (!category) return <div className="text-center py-40">Категория не найдена.</div>;

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-24 bg-white">
                <div className="max-w-screen-2xl mx-auto px-4 py-16">
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-playfair font-bold">{category.name}</h1>
                        <p className="text-lg text-gray-500 mt-4">{category.description}</p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {category.subcategories.map(sub => (
                            <SubCategoryCard key={sub.id} subcategory={sub} parentSlug={category.slug} />
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CategoryPage;