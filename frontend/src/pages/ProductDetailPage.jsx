import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/MainPage/Header';
import Footer from '../components/MainPage/Footer';
import { useFavorites } from '../contexts/FavoritesContext';
import ProductCard from '../components/catalog/ProductCard';

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

  const mainImageUrl = product.images?.[activeImage] ? `/images/${product.images[activeImage]}` : 'https://via.placeholder.com/800x1200';

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
            {/* Левая колонка: Галерея */}
            <div className="flex flex-col-reverse sm:flex-row gap-4 lg:sticky lg:top-24">
              <div className="flex sm:flex-col gap-3 justify-center">
                {product.images?.map((img, index) => (
                  <button
                    key={index}
                    className={`w-20 h-24 rounded-md overflow-hidden ring-2 ${activeImage === index ? 'ring-primary' : 'ring-transparent'}`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img src={`/images/${img}`} alt={`Превью ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <div className="flex-1 aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                <img src={mainImageUrl} alt={product.name} className="w-full h-full object-cover" />
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
    </div>
  );
};

export default ProductDetailPage;