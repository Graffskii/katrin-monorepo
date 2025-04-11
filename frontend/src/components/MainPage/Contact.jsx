import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    message: ''
  });
  const [notification, setNotification] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        showNotification('Вы были записаны!');
        setFormData({ name: '', number: '', message: '' });
      } else {
        showNotification('Ошибка при отправке заявки :(');
      }
    } catch (error) {
      showNotification('Ошибка соединения. Проверьте интернет.');
    }
  };

  const showNotification = (text) => {
    setNotification(text);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  return (
    <section id="contact" className="py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-playfair font-bold text-center text-gray-900 mb-12">Контакты</h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 mb-2">Имя</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border-none bg-white rounded" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Номер телефона</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-2 border-none bg-white rounded" 
                  name="number" 
                  value={formData.number}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Ваши пожелания</label>
                <textarea 
                  className="w-full px-4 py-2 border-none bg-white rounded h-32" 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-primary text-white px-8 py-3 rounded-button hover:bg-primary/90 transition-all cursor-pointer"
              >
                Записаться
              </button>
            </form>
          </div>
          <div>
            <div className="mb-8">
              <div className="bg-white p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 flex items-center justify-center text-primary">
                    <i className="ri-map-pin-line text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Адрес</h3>
                    <p className="text-gray-600">​ТЦ Роман, ​Проспект Ленина, 95, Томск</p>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 flex items-center justify-center text-primary">
                    <i className="ri-phone-line text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Телефон</h3>
                    <p className="text-gray-600">+7(3822)51-08-90</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 flex items-center justify-center text-primary">
                    <i className="ri-mail-line text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Почта</h3>
                    <p className="text-gray-600">katrin@yandex.ru</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[300px] rounded-lg overflow-hidden">
              <div style={{position: 'relative', overflow: 'hidden'}} className="w-full h-full object-cover">
                <a href="https://yandex.ru/maps/org/katrin/1079021179/?utm_medium=mapframe&utm_source=maps" style={{color: '#eee', fontSize: '12px', position: 'absolute', top: '0px'}}>Катрин</a>
                <a href="https://yandex.ru/maps/67/tomsk/category/bridal_salon/184108335/?utm_medium=mapframe&utm_source=maps" style={{color: '#eee', fontSize: '12px', position: 'absolute', top: '14px'}}>Свадебный салон в Томске</a>
                <a href="https://yandex.ru/maps/67/tomsk/category/clothing_store/184107943/?utm_medium=mapframe&utm_source=maps" style={{color: '#eee', fontSize: '12px', position: 'absolute', top: '28px'}}>Магазин одежды в Томске</a>
                <iframe src="https://yandex.ru/map-widget/v1/?ll=84.949607%2C56.481385&mode=search&oid=1079021179&ol=biz&z=17.05" width="100%" height="400" frameBorder="1" allowFullScreen={true} style={{position: 'relative'}}></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Уведомление */}
      {notification && (
        <div className="fixed bottom-4 right-4 bg-primary text-white px-6 py-3 rounded shadow-lg">
          {notification}
        </div>
      )}
    </section>
  );
};

export default Contact;