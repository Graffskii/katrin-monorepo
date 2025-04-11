import React, { useState } from 'react';

const UploadForm = () => {
  const [category, setCategory] = useState('Wedding Dresses');
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Выберите файл для загрузки');
      return;
    }

    const formData = new FormData();
    formData.append('category', category);
    formData.append('image', file);
    formData.append('caption', caption);

    setIsUploading(true);

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        setMessage('Фотография успешно загружена');
        setFile(null);
        setCaption('');
        // Сбросить input файла
        document.getElementById('fileInput').value = '';
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Ошибка при загрузке фотографии');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      setMessage('Ошибка при загрузке фотографии');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-playfair font-bold mt-8">Загрузить фотографию</h2>
      {message && (
        <div className={`mt-4 p-2 ${message.includes('успешно') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block">Выберите категорию:</label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 w-full"
          >
            <option value="Wedding Dresses">Свадебные платья</option>
            <option value="Evening Dresses">Вечерние платья</option>
            <option value="Decorations">Декорации</option>
          </select>
        </div>
        <div>
          <label className="block">Загрузите изображение:</label>
          <input 
            id="fileInput"
            type="file" 
            onChange={handleFileChange}
            className="border p-2 w-full" 
          />
        </div>
        <div>
          <label className="block">Описание:</label>
          <input 
            type="text" 
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="border p-2 w-full" 
          />
        </div>
        <button 
          type="submit"
          disabled={isUploading || !file}
          className={`${isUploading || !file ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white px-6 py-2 rounded transition-all`}
        >
          {isUploading ? 'Загрузка...' : 'Добавить'}
        </button>
      </form>
    </div>
  );
};

export default UploadForm;