import React, { useState } from 'react';
import Header from '../MainPage/Header';
import Footer from '../MainPage/Footer';

// Это упрощенная копия ProductDetailPage, которая не делает запросов к API
const ProductPreview = ({ formData, existingImages, onClose }) => {
    const [activeImage, setActiveImage] = useState(0);

    // Собираем все картинки в один массив для отображения
    // Сначала идут старые (загруженные), потом новые (выбранные с диска)
    const previewImages = [
        ...existingImages.map(img => `/images/${img.filename}`),
        ...Array.from(formData.images).map(file => URL.createObjectURL(file))
    ];

    const mainImageUrl = previewImages.length > 0 ? previewImages[activeImage] : 'https://via.placeholder.com/800x1200?text=Нет+фото';

    return (
        // Контейнер на весь экран поверх всего
        <div className="fixed inset-0 bg-white z-[200] overflow-y-auto">
            
            {/* Плавающая панель управления предпросмотром */}
            <div className="sticky top-0 z-50 bg-gray-900 text-white p-4 flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-3">
                    <span className="animate-pulse h-3 w-3 bg-red-500 rounded-full"></span>
                    <span className="font-bold tracking-widest uppercase text-sm">Режим предпросмотра</span>
                </div>
                <button 
                    onClick={onClose}
                    className="bg-white text-gray-900 px-6 py-2 rounded-md font-semibold hover:bg-gray-200 transition-colors"
                >
                    &larr; Вернуться в редактор
                </button>
            </div>

            {/* Имитация страницы товара (без Header и Footer, чтобы не отвлекали, или можно с ними) */}
            <div className="max-w-screen-2xl mx-auto px-4 py-12 mt-8">
                
                {/* Хлебные крошки (фейковые) */}
                <div className="text-sm text-gray-500 mb-8">
                    <span>Главная</span> <span className="mx-2">/</span>
                    <span>Каталог</span> <span className="mx-2">/</span>
                    <span className="text-primary font-medium">Предпросмотр</span>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Левая колонка: Галерея (Только десктопный вид для простоты предпросмотра) */}
                    <div className="w-full">
                        <div className="flex flex-col-reverse sm:flex-row gap-4 lg:sticky lg:top-24">
                            <div className="flex sm:flex-col gap-3 justify-start max-h-[75vh] overflow-y-auto no-scrollbar pb-4">
                                {previewImages.map((src, index) => (
                                    <button
                                        key={index}
                                        className={`w-20 h-28 flex-shrink-0 rounded-md overflow-hidden ring-2 transition-all ${activeImage === index ? 'ring-primary opacity-100' : 'ring-transparent opacity-60 hover:opacity-100'}`}
                                        onClick={() => setActiveImage(index)}
                                    >
                                        <img src={src} alt="Превью" className="w-full h-full object-cover"/>
                                    </button>
                                ))}
                            </div>
                            <div className="flex-1 aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                                <img src={mainImageUrl} alt="Главное фото" className="w-full h-full object-cover transition-opacity duration-300"/>
                            </div>
                        </div>
                    </div>

                    {/* Правая колонка: Информация */}
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-playfair font-bold text-gray-900 break-words">
                            {formData.name || 'Без названия'}
                        </h1>
                        <p className="text-sm text-gray-400 mt-2">Артикул: {formData.sku || 'Не указан'}</p>

                        <div className="mt-4">
                            <span className="text-3xl font-semibold text-gray-800">
                                {formData.price ? new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(formData.price) : '0 ₽'}
                            </span>
                            {formData.old_price && (
                                <span className="ml-4 text-xl text-gray-400 line-through">
                                    {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(formData.old_price)}
                                </span>
                            )}
                        </div>

                        <div className="mt-8 prose max-w-none text-gray-600 whitespace-pre-wrap">
                            <p>{formData.description || 'Описание отсутствует.'}</p>
                        </div>

                        <div className="mt-8 flex items-center gap-4 opacity-50 pointer-events-none">
                            <button className="flex-1 text-center bg-primary text-white px-8 py-4 rounded-md font-semibold">
                                Записаться на примерку (Отключено)
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPreview;