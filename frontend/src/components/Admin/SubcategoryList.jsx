import React, { useState, useEffect } from 'react';

const SubcategoryList = ({ categoryId, onSelectSubcategory }) => {
    const [subcategories, setSubcategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Состояние для модального окна
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', slug: '', seo_text: '', image: null });

    // Загрузка данных
    const fetchSubcategories = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/admin/categories/${categoryId}/subcategories`, { credentials: 'include' });
            const data = await response.json();
            setSubcategories(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSubcategories();
    }, [categoryId]);

    // Обработчик отправки формы (создание)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Для отправки файлов нужен FormData
        const data = new FormData();
        data.append('category_id', categoryId);
        data.append('name', formData.name);
        data.append('slug', formData.slug);
        data.append('seo_text', formData.seo_text);
        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            const response = await fetch('/api/admin/subcategories', {
                method: 'POST',
                credentials: 'include',
                body: data, // Content-Type браузер установит сам
            });

            if (response.ok) {
                setIsModalOpen(false); // Закрываем модалку
                setFormData({ name: '', slug: '', seo_text: '', image: null }); // Очищаем форму
                fetchSubcategories(); // Обновляем список
            } else {
                alert('Ошибка при создании');
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (isLoading) return <div>Загрузка подкатегорий...</div>;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Шапка компонента */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-bold text-gray-800">Разделы (Подкатегории)</h2>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors text-sm font-medium"
                >
                    + Добавить раздел
                </button>
            </div>

            {/* Список подкатегорий (Таблица для компактности) */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600 text-sm uppercase">
                            <th className="p-4 border-b">Фото</th>
                            <th className="p-4 border-b">Название</th>
                            <th className="p-4 border-b">URL (Slug)</th>
                            <th className="p-4 border-b text-right">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subcategories.length === 0 && (
                            <tr><td colSpan="4" className="p-8 text-center text-gray-500">В этой категории пока нет разделов</td></tr>
                        )}
                        {subcategories.map(sub => (
                            <tr key={sub.id} className="border-b hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <div className="w-16 h-20 bg-gray-200 rounded overflow-hidden">
                                        {sub.cover_image && <img src={`/images/${sub.cover_image}`} alt={sub.name} className="w-full h-full object-cover" />}
                                    </div>
                                </td>
                                <td className="p-4 font-semibold text-gray-800">{sub.name}</td>
                                <td className="p-4 text-gray-500">{sub.slug}</td>
                                <td className="p-4 text-right">
                                    <button className="text-gray-500 hover:text-blue-500 mr-4 text-sm font-medium">Изменить</button>
                                    {/* Открываем список товаров */}
                                    <button 
                                        onClick={() => onSelectSubcategory(sub)}
                                        className="bg-primary/10 text-primary px-4 py-2 rounded text-sm font-semibold hover:bg-primary hover:text-white transition-colors"
                                    >
                                        Управлять платьями &rarr;
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* МОДАЛЬНОЕ ОКНО СОЗДАНИЯ */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h3 className="text-xl font-bold">Новый раздел</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-800 text-2xl leading-none">&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Название (например: Пышные)</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded p-2 focus:ring-primary focus:border-primary outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL / Slug (на английском: puffy)</label>
                                <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')})} className="w-full border border-gray-300 rounded p-2 focus:ring-primary focus:border-primary outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Текст (описание снизу)</label>
                                <textarea rows="3" value={formData.seo_text} onChange={e => setFormData({...formData, seo_text: e.target.value})} className="w-full border border-gray-300 rounded p-2 focus:ring-primary focus:border-primary outline-none"></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Обложка</label>
                                <input type="file" accept="image/*" onChange={e => setFormData({...formData, image: e.target.files[0]})} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                            </div>
                            
                            <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded">Отмена</button>
                                <button type="submit" className="px-4 py-2 text-white bg-primary hover:bg-primary/90 rounded font-medium">Создать</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubcategoryList;