import React, { useState, useEffect } from 'react';
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
    // --- ТЕПЕРЬ МЫ ХРАНИМ ДАННЫЕ В СТЕЙТЕ ---
    const [reviews, setReviews] = useState([]);
    const [brides, setBrides] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    // --- ДЕЛАЕМ ЗАПРОС К НАШЕМУ НОВОМУ API ПРИ ЗАГРУЗКЕ СТРАНИЦЫ ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Используем Promise.all для параллельной загрузки (чтобы было быстрее)
                const [reviewsRes, bridesRes] = await Promise.all([
                    fetch('/api/catalog/reviews'),
                    fetch('/api/catalog/brides')
                ]);

                const reviewsData = await reviewsRes.json();
                const bridesData = await bridesRes.json();

                setReviews(reviewsData);
                setBrides(bridesData);
            } catch (error) {
                console.error("Ошибка загрузки данных:", error);
            }
        };
        fetchData();
    }, []);

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
                            {reviews.map((review) => (
                                <SwiperSlide key={review.id} className="!w-auto cursor-pointer" onClick={() => setSelectedImage(review.filename)}>
                                    <img
                                        // Файлы теперь лежат в общей папке /images/, так как их туда загружает multer
                                        src={`/images/${review.filename}`}
                                        alt="Отзыв"
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
                            {brides.map((bride) => (
                                <img
                                    key={bride.id}
                                    src={`/images/${bride.filename}`}
                                    onClick={() => setSelectedImage(bride.filename)}
                                    alt="Невеста"
                                    className="w-full h-auto object-cover mb-4 break-inside-avoid rounded-md shadow-sm"
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