import React, { useState, useEffect } from 'react';

// Компонент принимает title (Заголовок) и apiPath (путь к API, например 'reviews' или 'brides')
const SimpleGalleryManager = ({ title, apiPath }) => {
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);

    // 1. Загрузка списка
    const fetchImages = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/admin/${apiPath}`, { credentials: 'include' });
            const data = await res.json();
            setImages(data);
        } catch (error) { console.error(error); } 
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchImages(); }, [apiPath]);

    // 2. Массовая загрузка файлов
    const handleUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setIsUploading(true);
        const formData = new FormData();
        files.forEach(file => formData.append('images', file));

        try {
            const res = await fetch(`/api/admin/${apiPath}`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });
            if (res.ok) {
                fetchImages(); // Обновляем галерею после загрузки
                e.target.value = ''; // Сбрасываем инпут
            } else {
                const errorData = await res.json(); 
                alert(`Ошибка загрузки: ${errorData.error}`); 
            }
        } catch (error) { console.error(error); } 
        finally { setIsUploading(false); }
    };

    // 3. Удаление одного фото
    const handleDelete = async (id) => {
        if (!window.confirm("Удалить фотографию?")) return;
        
        try {
            const res = await fetch(`/api/admin/${apiPath}/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (res.ok) {
                // Обновляем UI без перезагрузки всей галереи
                setImages(prev => prev.filter(img => img.id !== id));
            }
        } catch (error) { console.error(error); }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8 pb-4 border-b">
                <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                
                {/* Кастомная кнопка загрузки файлов */}
                <div className="relative">
                    <input 
                        type="file" multiple accept="image/*" 
                        onChange={handleUpload} 
                        disabled={isUploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-wait" 
                    />
                    <button className={`bg-primary text-white px-6 py-2 rounded-md font-medium transition-colors ${isUploading ? 'bg-primary/50' : 'hover:bg-primary/90'}`}>
                        {isUploading ? 'Загрузка...' : '+ Загрузить фото'}
                    </button>
                </div>
            </div>

            {isLoading ? (
                <p>Загрузка галереи...</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {images.map(img => (
                        <div key={img.id} className="relative aspect-[3/4] bg-gray-100 rounded-md overflow-hidden group">
                            <img src={`/images/${img.filename}`} alt="" className="w-full h-full object-cover" />
                            
                            {/* Оверлей с кнопкой удаления (появляется при наведении) */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button 
                                    onClick={() => handleDelete(img.id)}
                                    className="bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-600 shadow-lg text-xl"
                                >
                                    &times;
                                </button>
                            </div>
                            
                            {/* Индикатор статуса (если нужно будет отключать показ некоторых фото) */}
                            {!img.is_published && (
                                <div className="absolute top-2 left-2 bg-yellow-400 text-xs px-2 py-1 rounded-full font-bold">Скрыто</div>
                            )}
                        </div>
                    ))}
                    {images.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-400">
                            Галерея пуста. Загрузите первые фотографии.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SimpleGalleryManager;