import React, { useState, useEffect } from 'react';
import Header from '../components/MainPage/Header';
import Footer from '../components/MainPage/Footer';
import CategoriesGrid from '../components/MainPage/CategoriesGrid';
import { useParams, Link } from 'react-router-dom';

import ServicesBanner from '../components/MainPage/ServicesBanner';

const CatalogLandingPage = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCatalogData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/catalog/structure');
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Ошибка загрузки каталога:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCatalogData();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            {/* --- ИЗМЕНЯЕМ ФОН И СТРУКТУРУ --- */}
            <main className="flex-grow pt-24">
                <div className="max-w-screen-2xl mx-auto px-4 py-16">
                    <div className="text-sm text-gray-500 mb-8">
                        <Link to="/" className="hover:text-primary">Главная</Link>
                        <span className="mx-2">/</span>
                        <span>Каталог</span>
                    </div>
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-playfair font-bold text-gray-800">Каталог</h1>
                        <p className="text-lg text-gray-600 mt-4">Выберите интересующий вас раздел</p>
                    </div>
                    {isLoading ? (
                        <p className="text-center">Загрузка...</p>
                    ) : (
                        // Используем наш универсальный компонент, который уже имеет вытянутые карточки
                        <CategoriesGrid categories={categories} />
                    )}
                </div>
            </main>
            <ServicesBanner />
            <Footer />
        </div>
    );
};

export default CatalogLandingPage;