import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/MainPage/Header';
import Footer from '../components/MainPage/Footer';
import { useFavorites } from '../contexts/FavoritesContext';
import ProductCard from '../components/catalog/ProductCard';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const RelatedProductsSlider = ({ currentProductId, subcategorySlug }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    if (!subcategorySlug) return;
    const fetchRelated = async () => {
      try {
        // Запрашиваем всю подкатегорию
        const res = await fetch(`/api/catalog/subcategory/${subcategorySlug}`);
        const data = await res.json();
        // Фильтруем: убираем текущий товар и берем первые 4 штуки
        const filtered = data.products
          .filter(p => p.id !== currentProductId)
          .slice(0, 4);
        setRelatedProducts(filtered);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRelated();
  }, [subcategorySlug, currentProductId]);

  if (relatedProducts.length === 0) return null;

  return (
    <div className="mt-24 border-t pt-16 lg:text-xl">
      <h2 className="text-3xl font-playfair font-bold text-center mb-12">Похожие модели</h2>
      {/* Используем простую сетку вместо сложного слайдера, это надежнее и красивее для 4 товаров */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {relatedProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            isFavorite={isFavorite(product.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </div>
  );
};


const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const fetchProduct = async () => {
      window.scrollTo(0, 0);
      setIsLoading(true);
      try {
        const response = await fetch(`/api/catalog/product/${productId}`);
        if (!response.ok) throw new Error('Товар не найден');
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  if (isLoading) return <div className="text-center py-40">Загрузка...</div>;
  if (!product) return <div className="text-center py-40">Товар не найден.</div>;

  const imagesList = product.images || [];
  const hasMultipleImages = imagesList.length > 1;

  const mainImageUrl = product.images?.[activeImage] ? `/images/${product.images[activeImage]}` : 'https://via.placeholder.com/800x1200';

  // Функции для стрелок на ПК
  const nextImage = (e) => {
    e.stopPropagation(); // Чтобы не открывался лайтбокс при клике на стрелку
    setActiveImage((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1));
  };
  const prevImage = (e) => {
    e.stopPropagation();
    setActiveImage((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1));
  };

  return (
    <div className="flex flex-col min-h-screen lg:text-xl">
      <main className="flex-grow pt-24 bg-white">
        <div className="max-w-screen-2xl mx-auto px-4 py-12">
          {/* Хлебные крошки */}
          <div className="text-sm text-gray-500 mb-8">
            <Link to="/" className="hover:text-primary">Главная</Link>
            <span className="mx-2">/</span>
            <Link to="/catalog" className="hover:text-primary">Каталог</Link>
            {product.category_slug && (
              <>
                <span className="mx-2">/</span>
                <Link to={`/catalog/${product.category_slug}`} className="hover:text-primary">{product.category_name}</Link>
              </>
            )}
            {product.subcategory_slug && (
              <>
                <span className="mx-2">/</span>
                <Link to={`/catalog/${product.category_slug}/${product.subcategory_slug}`} className="hover:text-primary">{product.subcategory_name}</Link>
              </>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* --- ЛЕВАЯ КОЛОНКА: ГАЛЕРЕЯ --- */}
            <div className="w-full min-w-0">

              {/* 1. Мобильная галерея (Swiper со свайпами и стрелками) */}
              <div className="block lg:hidden -mx-4 relative">
                <Swiper
                  modules={[Pagination, Navigation]}
                  spaceBetween={0}
                  slidesPerView={1}
                  pagination={{ clickable: true }}
                  navigation={hasMultipleImages} // Включаем встроенные стрелки Swiper
                  className="aspect-[3/4] w-full bg-gray-100"
                >
                  {imagesList.map((img, index) => (
                    <SwiperSlide key={index} onClick={() => setIsLightboxOpen(true)}>
                      <img src={`/images/${img}`} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* 2. Десктопная галерея (Превью + Большое фото со стрелками) */}
              <div className="hidden lg:flex flex-row gap-4 lg:sticky lg:top-24">
                {/* Миниатюры */}
                <div className="flex flex-col gap-3 justify-start max-h-[75vh] overflow-y-auto no-scrollbar pb-4">
                  {imagesList.map((img, index) => (
                    <button
                      key={index}
                      className={`w-20 h-28 flex-shrink-0 rounded-md overflow-hidden ring-2 transition-all ${activeImage === index ? 'ring-primary opacity-100' : 'ring-transparent opacity-60 hover:opacity-100'}`}
                      onClick={() => setActiveImage(index)}
                    >
                      <img src={`/images/${img}`} alt={`Превью ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                {/* Главное фото со стрелками и кликом для лайтбокса */}
                <div
                  className="flex-1 aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden relative group cursor-pointer"
                  onClick={() => setIsLightboxOpen(true)}
                >
                  <img src={mainImageUrl} alt={product.name} className="w-full h-full object-cover transition-opacity duration-300" />

                  {/* Кастомные стрелки (показываются при наведении) */}
                  {hasMultipleImages && (
                    <>
                      {/* Убрали bg-white, оставили только бордовый цвет текста */}
                      <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:text-primary/70">
                        {/* Иконка шеврона влево (тонкая) */}
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                      </button>
                      <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:text-primary/70">
                        {/* Иконка шеврона вправо (тонкая) */}
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Правая колонка: Информация */}
            <div>
              <Link to="/catalog" className="text-sm text-gray-500 hover:text-primary mb-4 inline-block">&larr; Назад к списку платьев</Link>
              <h1 className="text-4xl font-playfair font-bold text-gray-900">{product.name}</h1>
              {product.sku && <p className="text-sm text-gray-400 mt-2">Артикул: {product.sku}</p>}

              <div className="mt-4">
                <span className="text-3xl font-semibold text-gray-800">
                  {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(product.price)}
                </span>
                {product.old_price && (
                  <span className="ml-4 text-xl text-gray-400 line-through">
                    {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(product.old_price)}
                  </span>
                )}
              </div>

              <div className="mt-8 prose max-w-none text-gray-600">
                <p>{product.description}</p>
              </div>

              <div className="mt-8 flex items-center gap-4">
                <Link to="/appointment" className="flex-1 text-center bg-primary text-white px-8 py-3 rounded-md font-semibold hover:bg-primary/90 transition-all shadow">
                  Записаться на примерку
                </Link>
              </div>
            </div>
          </div>

          <RelatedProductsSlider currentProductId={product.id} subcategorySlug={product.subcategory_slug} />
        </div>
      </main>
      {isLightboxOpen && (
        <div
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 lg:p-12"
          onClick={() => setIsLightboxOpen(false)}
        >
          <img
            src={mainImageUrl}
            alt={product.name}
            className="max-w-full max-h-full object-contain select-none"
            onClick={(e) => e.stopPropagation()} // Не закрывать при клике на саму картинку
          />

          {/* Кнопка закрытия */}
          <button
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-2xl transition-colors"
            onClick={() => setIsLightboxOpen(false)}
          >
            &times;
          </button>

          {/* Стрелки в лайтбоксе (только для ПК, на мобилках можно просто закрыть и свайпнуть) */}
          {hasMultipleImages && (
            <>
              <button onClick={prevImage} className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full items-center justify-center text-white text-2xl transition-colors">
                &#10094;
              </button>
              <button onClick={nextImage} className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full items-center justify-center text-white text-2xl transition-colors">
                &#10095;
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;