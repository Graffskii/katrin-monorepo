import React from 'react';
import Header from '../components/MainPage/Header';
import Footer from '../components/MainPage/Footer';

const ServiceDetailCard = ({ title, description, image, reverse = false }) => (
    <div className={`grid md:grid-cols-2 gap-12 items-center ${reverse ? 'md:grid-flow-row-dense' : ''}`}>
        <div className={`h-96 rounded-lg overflow-hidden ${reverse ? 'md:col-start-2' : ''}`}>
            <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
        <div>
            <h3 className="text-3xl font-playfair font-bold text-gray-800 mb-4">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
    </div>
);

const ServicesPage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="lg:text-xl flex-grow text-gray-600 font-light leading-relaxed space-y-6
          [&_h2]:text-4xl [&_h2]:font-playfair [&_h2]:text-center [&_h2]:mb-8
          [&_h3]:text-2xl [&_h3]:font-playfair [&_h3]:mt-10
          [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-2
          [&_strong]:font-semibold [&_strong]:text-gray-700">
                <div className="bg-gray-100 pt-32 pb-16 mt-8 text-center">
                    <h1 className="text-6xl font-playfair font-bold text-gray-800">Наши Услуги</h1>
                    <p className="text-lg text-gray-600 mt-4">Всё, чтобы ваш образ был совершенным</p>
                </div>
                <div className="py-24 bg-white">
                    <div className="max-w-screen-2xl mx-auto px-4 space-y-20">
                        <ServiceDetailCard
                            title="Корректировка и подгонка платья"
                            description="Наши опытные портные доведут ваше платье до идеала. Мы выполним подгонку по фигуре, скорректируем длину и добавим или уберем детали по вашему желанию, чтобы платье сидело на вас безупречно в самый важный день."
                            image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTozS_8lVnpYlSFDdz4b6Il5-Ho3svSF6woPw&s" // Замените фото
                        />
                        <ServiceDetailCard
                            title="Предсвадебная подготовка и хранение"
                            description="Мы позаботимся о вашем наряде до самого дня торжества. Услуга включает профессиональное отпаривание, подготовку фаты и аксессуаров, а также бережное хранение в специальном чехле в нашем салоне."
                            image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFglZN3YcRDpopQkS8BYbs3hMvQ0OSCwWuxA&s" // Замените фото
                            reverse={true}
                        />
                        <ServiceDetailCard
                            title="Выгодная рассрочка"
                            description="Мечта не должна ждать. Мы предлагаем удобные и честные условия рассрочки без процентов и переплат на любое платье из нашей коллекции. Позвольте себе лучшее без компромиссов."
                            image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-6Kj9LLLgMB7nrGRSlD2eRRYqjzr6412ANw&s" // Замените фото
                        />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ServicesPage;