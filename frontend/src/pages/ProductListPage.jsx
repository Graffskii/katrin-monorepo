import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/MainPage/Header';
import Footer from '../components/MainPage/Footer';
import ProductCard from '../components/catalog/ProductCard';
import { useFavorites } from '../contexts/FavoritesContext';
import SeoText from '../components/SeoText';

import ServicesBanner from '../components/MainPage/ServicesBanner';

const ProductListPage = () => {
    const { categorySlug, subCategorySlug } = useParams();
    const [subcategory, setSubcategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('default');
    const { isFavorite, toggleFavorite } = useFavorites();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/catalog/subcategory/${subCategorySlug}`);
                const data = await response.json();
                setSubcategory(data);
                setProducts(data.products || []);
            } catch (error) {
                console.error("Ошибка загрузки товаров:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [subCategorySlug]);

    const sortedProducts = useMemo(() => {
        const sorted = [...products];
        if (sortOrder === 'price-asc') {
            return sorted.sort((a, b) => a.price - b.price);
        }
        if (sortOrder === 'price-desc') {
            return sorted.sort((a, b) => b.price - a.price);
        }
        return sorted; // 'default'
    }, [products, sortOrder]);

    if (isLoading) return <div className="text-center py-40">Загрузка...</div>;
    if (!subcategory) return <div className="text-center py-40">Раздел не найден.</div>;

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-24 bg-white lg:text-xl">
                <div className="max-w-screen-2xl mx-auto px-4 py-16">
                    {/* Хлебные крошки */}
                    <div className="text-sm text-gray-500 mb-8">
                        <Link to="/" className="hover:text-primary">Главная</Link>
                        <span className="mx-2">/</span>
                        <Link to="/catalog" className="hover:text-primary">Каталог</Link>
                        {subcategory.category_slug && ( // Проверяем, что данные пришли
                            <>
                                <span className="mx-2">/</span>
                                <Link to={`/catalog/${subcategory.category_slug}`} className="hover:text-primary">
                                    {subcategory.category_name}
                                </Link>
                            </>
                        )}
                        <span className="mx-2">/</span>
                        <span>{subcategory.name}</span>
                    </div>

                    <h1 className="text-4xl font-playfair font-bold text-center mb-12">{subcategory.name}</h1>

                    {/* Панель фильтров и сортировки */}
                    <div className="flex justify-between items-center mb-8 border-b pb-4">
                        <div>
                            {/* TODO: Кнопка для мобильных фильтров */}
                        </div>
                        <div className="flex items-center gap-2">
                            <label htmlFor="sort" className="text-sm text-gray-600">Порядок:</label>
                            <select
                                id="sort"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="border-gray-300 rounded-md shadow-sm text-sm"
                            >
                                <option value="default">по умолчанию</option>
                                <option value="price-asc">сначала дешевле</option>
                                <option value="price-desc">сначала дороже</option>
                            </select>
                        </div>
                    </div>

                    {/* Сетка товаров */}
                    {sortedProducts.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                            {sortedProducts.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    isFavorite={isFavorite(product.id)}
                                    onToggleFavorite={toggleFavorite}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-20">В этом разделе пока нет платьев.</p>
                    )
                    }
                    {subcategory.seo_text && (
                        <div className="mt-24 prose max-w-none text-gray-600">
                            <SeoText>
                                <h2>Коллекция Вечерних Платьев</h2>
                                <p>
                                    Вечернее платье — это ваш персональный код элегантности. Оно должно интриговать, восхищать и дарить абсолютную уверенность в себе. В коллекции салона «Katrin» собраны наряды, достойные красной ковровой дорожки.
                                </p>
                                <h3>Разнообразие стилей для любого торжества</h3>
                                <ul>
                                    <li><strong>Платья в пол (Макси):</strong> Неувядающая классика, символизирующая статус и грацию. Идеальный выбор для гала-вечеров, оперных премьер и официальных приемов. Благородный бархат, струящийся шелк и деликатное кружево создают поистине королевский образ.</li>
                                    <li><strong>Коктейльные платья (Миди и Мини):</strong> Динамичные, стильные и немного дерзкие. Отлично подходят для корпоративных вечеринок, дней рождения и романтических ужинов.</li>
                                    <li><strong>Утонченный минимализм:</strong> Лаконичные силуэты без лишних деталей, где главную роль играет безупречный крой и качество ткани.</li>
                                </ul>
                                <p>
                                    Каждое мероприятие уникально, как и вы. Позвольте нам помочь вам блистать. Запишитесь на примерку, и мы подберем образ, который станет украшением вечера.
                                </p>
                            </SeoText>
                        </div>
                    )}
                </div>
            </main>
            <ServicesBanner />
            <Footer />
        </div>
    );
};

export default ProductListPage;