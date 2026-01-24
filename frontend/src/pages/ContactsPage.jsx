import React from 'react';
import Header from '../components/MainPage/Header';
import Footer from '../components/MainPage/Footer';

const ContactsPage = () => {
  // TODO: Добавить логику для переключения между городами
  const activeCity = 'tomsk'; 

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* Верхний блок с заголовком */}
        <div className="bg-gray-100 pt-32 pb-16 text-center">
            <h1 className="text-6xl font-playfair font-bold text-gray-800">Контакты</h1>
        </div>

        {/* Основной контент */}
        <div className="bg-white py-16">
            <div className="max-w-screen-2xl mx-auto px-4">
                {/* Переключатель городов */}
                <div className="flex justify-center mb-12">
                    <div className="flex border border-gray-300 rounded-md p-1">
                        <button className={`px-8 py-2 rounded-md transition-colors ${activeCity === 'tomsk' ? 'bg-gray-200' : ''}`}>Томск</button>
                        <button className={`px-8 py-2 rounded-md transition-colors ${activeCity === 'kemerovo' ? 'bg-gray-200' : ''}`}>Кемерово</button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Карта */}
                    <div className="h-[500px] rounded-md overflow-hidden">
                        <div style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%' }}>
                            <a href="https://yandex.ru/maps/org/katrin/1079021179/?utm_medium=mapframe&utm_source=maps" style={{ color: '#eee', fontSize: '12px', position: 'absolute', top: '0px' }}>Катрин</a>
                            <iframe src="https://yandex.ru/map-widget/v1/?ll=84.949607%2C56.481385&mode=search&oid=1079021179&ol=biz&z=17" width="100%" height="100%" frameBorder="1" allowFullScreen={true} style={{ position: 'relative' }}></iframe>
                        </div>
                    </div>

                    {/* Информация */}
                    <div className="bg-secondary p-12 rounded-md flex flex-col justify-center">
                        <h2 className="text-3xl font-playfair font-bold text-gray-800">Салон свадебной и вечерней моды KATRIN</h2>
                        <h3 className="text-2xl font-playfair mt-2">Г. ТОМСК</h3>
                        <div className="mt-8 space-y-4 text-lg text-gray-700 border-t pt-8">
                            <p><strong>ТЕЛ:</strong> +7 (3822) 51-08-90</p>
                            <p><strong>АДРЕС:</strong> Проспект Ленина, 95</p>
                            <p><strong>РЕЖИМ РАБОТЫ:</strong> ПН-СБ 10:00-19:00, ВС 11:00-18:00</p>
                        </div>
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