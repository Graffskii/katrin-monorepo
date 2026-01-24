import React from 'react';
import Header from '../components/MainPage/Header';
import Footer from '../components/MainPage/Footer';

const AppointmentPage = () => {
  // TODO: Добавить логику формы (useState, handleSubmit)
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 bg-white">
        <div className="max-w-screen-2xl mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Левая колонка: Форма */}
            <div className="order-2 lg:order-1">
              <h1 className="text-3xl font-playfair font-bold mb-2">Записаться на примерку</h1>
              <p className="text-gray-500 mb-8">Пожалуйста, заполните заявку</p>
              <form className="space-y-6">
                <div>
                  <label className="text-sm text-gray-600">Ваше имя</label>
                  <input type="text" className="w-full mt-1 p-3 border-b-2 focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Телефон</label>
                  <input type="tel" className="w-full mt-1 p-3 border-b-2 focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Желаемая дата</label>
                  <input type="date" className="w-full mt-1 p-3 border-b-2 focus:border-primary outline-none" />
                </div>
                {/* ... другие поля (время, выбор салона) ... */}
                <button type="submit" className="w-full bg-primary text-white py-4 rounded-md font-semibold hover:bg-primary/90 transition-all">
                  Отправить
                </button>
              </form>
            </div>
            {/* Правая колонка: Изображение */}
            <div className="order-1 lg:order-2 h-96 lg:h-[600px] rounded-lg overflow-hidden">
                <img src="https://images.unsplash.com/photo-1587398322879-8395f3969145?q=80&w=1964" alt="Примерка платья" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AppointmentPage;