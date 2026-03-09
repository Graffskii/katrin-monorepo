import React from 'react';

const SeoText = ({ children }) => {
  return (
    <div className="mt-16 bg-white py-12">
      <div className="max-w-screen-2xl mx-auto px-4 lg:text-2xl">
        {/* Применяем стили к дочерним элементам напрямую */}
        <div className="
          text-gray-600 font-light leading-relaxed space-y-6
          [&_h2]:text-4xl [&_h2]:font-playfair [&_h2]:text-gray-800 [&_h2]:text-center [&_h2]:mb-8
          [&_h3]:text-2xl [&_h3]:font-playfair [&_h3]:text-gray-800 [&_h3]:mt-10
          [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-2
          [&_strong]:font-semibold [&_strong]:text-gray-700
        ">
          {children}
        </div>
      </div>
    </div>
  );
};


export default SeoText;