import React from 'react';
import Header from '../components/MainPage/Header';
import Footer from '../components/MainPage/Footer';
// TODO: Добавить компонент карты (Yandex Maps)

const ContactsPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 py-16">
          <h1 className="text-5xl font-playfair font-bold text-center mb-16">Контакты</h1>
          {/* TODO: Добавить переключатель городов */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-gray-200 h-96 lg:h-full rounded-md">
              {/* Здесь будет карта */}
              <div className="h-[300px] rounded-lg overflow-hidden">
              <div style={{position: 'relative', overflow: 'hidden'}} className="w-full h-full object-cover">
                <a href="https://yandex.ru/maps/org/katrin/1079021179/?utm_medium=mapframe&utm_source=maps" style={{color: '#eee', fontSize: '12px', position: 'absolute', top: '0px'}}>Катрин</a>
                <a href="https://yandex.ru/maps/67/tomsk/category/bridal_salon/184108335/?utm_medium=mapframe&utm_source=maps" style={{color: '#eee', fontSize: '12px', position: 'absolute', top: '14px'}}>Свадебный салон в Томске</a>
                <a href="https://yandex.ru/maps/67/tomsk/category/clothing_store/184107943/?utm_medium=mapframe&utm_source=maps" style={{color: '#eee', fontSize: '12px', position: 'absolute', top: '28px'}}>Магазин одежды в Томске</a>
                <iframe src="https://yandex.ru/map-widget/v1/?ll=84.949607%2C56.481385&mode=search&oid=1079021179&ol=biz&z=17.05" width="100%" height="400" frameBorder="1" allowFullScreen={true} style={{position: 'relative'}}></iframe>
              </div>
            </div>
            </div>
            <div className="bg-secondary p-8 rounded-md">
              <h2 className="text-2xl font-playfair font-bold">Салон в Томске</h2>
              <div className="mt-6 space-y-4 text-gray-700">
                <p><strong>Адрес:</strong> Проспект Ленина 95</p>
                <p><strong>Телефон:</strong> +7 (383) 226-34-85</p>
                <p><strong>Режим работы:</strong> ПН-СБ 10:00-20:00, ВС 11:00-19:00</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactsPage;