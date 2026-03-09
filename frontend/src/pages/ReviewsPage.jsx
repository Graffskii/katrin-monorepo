import React, { useState } from 'react';
import Header from '../components/MainPage/Header';
import Footer from '../components/MainPage/Footer';
import ServicesBanner from '../components/MainPage/ServicesBanner';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

// --- ДАННЫЕ-ЗАГЛУШКИ ---
const reviewScreenshots = Array.from({ length: 7 }, (_, i) => `screenshot-${i + 1}.jpg`);
const bridePhotos = Array.from({ length: 15 }, (_, i) => `bride-${i + 1}.jpg`);

// --- КОМПОНЕНТ СТРАНИЦЫ ---
const ReviewsPage = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    return (
        <div className="flex flex-col min-h-screen lg:text-xl">
            <Header />
            <main className="flex-grow">
                {/* Секция 1: Карусель скриншотов отзывов */}
                <div className="bg-gray-100 pt-32 pb-16">
                    <div className="text-center mb-12">
                        <h1 className="text-6xl font-playfair font-bold text-gray-800">Отзывы</h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
                            Мы гордимся доверием наших невест и благодарны за ваши теплые слова.
                        </p>
                    </div>
                    <div className="max-w-screen-3xl mx-auto px-4">
                        <Swiper
                            modules={[Navigation, Autoplay]}
                            spaceBetween={20}
                            slidesPerView={'auto'} // Автоматическая ширина слайдов
                            centeredSlides={true}
                            loop={true}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                            }}
                            navigation
                            className="h-[500px]" // Задаем высоту для всей карусели
                        >
                            {reviewScreenshots.map((screenshot, index) => (
                                <SwiperSlide key={index} className="!w-auto" onClick={() => setSelectedImage('reviews/'+screenshot)}> {/* Ширина слайда по контенту */}
                                    <img 
                                        src={`/images/reviews/${screenshot}`} 
                                        alt={`Отзыв ${index + 1}`}
                                        className="h-full w-auto object-contain rounded-lg shadow-lg"
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>

                {/* Секция 2: Галерея "Наши невесты" */}
                <div className="py-24 bg-white">
                    <div className="max-w-screen-3xl mx-auto px-4">
                        <h2 className="text-4xl font-playfair text-gray-900 font-bold text-center mb-12">Наши невесты</h2>
                        {/* Для masonry-галереи проще всего использовать CSS-колонки */}
                        <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
                            {bridePhotos.map((photo, index) => (
                                <img 
                                    key={index}
                                    src={`/images/brides/${photo}`} 
                                    alt={`Невеста ${index + 1}`}
                                    className="w-full h-auto object-cover mb-4 break-inside-avoid rounded-md shadow-sm"
                                    onClick={() => setSelectedImage('brides/'+photo)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Секция 3: Баннер "Дополнительные услуги" */}
                <ServicesBanner />

            </main>
            <Footer />

            {selectedImage && (
                <div 
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <img 
                        src={`/images/${selectedImage}`} 
                        alt="Просмотр отзыва"
                        className="max-w-full max-h-full object-contain"
                        onClick={(e) => e.stopPropagation()} // Предотвращаем закрытие по клику на само фото
                    />
                    <button 
                        className="absolute top-4 right-4 text-white text-4xl"
                        onClick={() => setSelectedImage(null)}
                    >
                        &times;
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReviewsPage;