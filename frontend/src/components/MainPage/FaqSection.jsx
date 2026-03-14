import React, { useState } from 'react';

const faqs = [
  {
    question: "Нужно ли записываться на примерку заранее?",
    answer: "Да, мы настоятельно рекомендуем записываться заранее. Это гарантирует, что консультант уделит вам максимум времени, а примерочная будет свободна только для вас."
  },
  {
    question: "Сколько длится стандартная примерка?",
    answer: "Обычно примерка занимает от 1 до 1.5 часов. Этого времени достаточно, чтобы в спокойной обстановке примерить 5-7 различных платьев и определиться со стилем."
  },
  {
    question: "Можно ли фотографировать платья во время примерки?",
    answer: "Конечно! Мы даже рекомендуем делать фотографии, чтобы вам было проще сравнить образы и принять правильное решение дома."
  },
  {
    question: "Предоставляете ли вы услуги подгонки по фигуре?",
    answer: "Да, в нашем салоне работает профессиональное ателье. Мы посадим выбранное платье идеально по вашей фигуре, скорректируем длину и детали."
  }
];

const FaqItem = ({ faq, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full py-6 flex justify-between items-center text-left focus:outline-none"
        onClick={onClick}
      >
        <span className="text-2xl font-playfair font-semibold text-gray-800">{faq.question}</span>
        <span className="ml-6 flex-shrink-0 text-primary">
          <svg className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100 mb-6' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-gray-600 lg:text-xl">{faq.answer}</p>
      </div>
    </div>
  );
};

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0); // Первый открыт по умолчанию

  return (
    <section className="py-24 bg-white">
      <div className="mx-auto px-4 max-w-screen-2xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-playfair font-bold text-gray-900">Частые вопросы</h2>
        </div>
        <div className="border-t border-gray-200">
          {faqs.map((faq, index) => (
            <FaqItem 
              key={index} 
              faq={faq} 
              isOpen={index === openIndex} 
              onClick={() => setOpenIndex(index === openIndex ? -1 : index)} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;