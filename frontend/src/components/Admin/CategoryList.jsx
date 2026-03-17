import React, { useState, useEffect } from 'react';

const CategoryList = ({ onSelectCategory }) => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', slug: '', description: '', image: null });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/admin/categories', { credentials: 'include' });
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditClick = (cat) => {
        setFormData({ name: cat.name, slug: cat.slug, description: cat.description || '', image: null });
        setEditingCategory(cat);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('slug', formData.slug);
        data.append('description', formData.description);
        if (formData.image) data.append('image', formData.image);

        try {
            const response = await fetch(`/api/admin/categories/${editingCategory.id}`, {
                method: 'PUT',
                credentials: 'include',
                body: data,
            });
            if (response.ok) {
                setIsModalOpen(false);
                fetchCategories();
            }
        } catch (error) { console.error(error); }
    };

    if (isLoading) return <div>Загрузка категорий...</div>;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Главные категории</h2>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {categories.map(cat => (
                    <div key={cat.id} className="border rounded-lg overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
                        <div className="h-100 bg-gray-200 relative">
                            {cat.cover_image ? (
                                <img src={`/images/${cat.cover_image}`} alt={cat.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">Нет фото</div>
                            )}
                        </div>
                        <div className="p-4 flex-grow flex flex-col">
                            <h3 className="font-bold text-lg mb-1">{cat.name}</h3>
                            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{cat.slug}</p>
                            
                            <div className="mt-auto grid grid-cols-2 gap-2">
                                <button 
                                    onClick={() => onSelectCategory(cat)}
                                    className="bg-primary/10 text-primary py-2 rounded text-sm font-semibold hover:bg-primary hover:text-white transition-colors"
                                >
                                    Открыть
                                </button>
                                <button onClick={() => handleEditClick(cat)} className="bg-gray-100 text-gray-700 py-2 rounded text-sm font-semibold hover:bg-gray-200 transition-colors">
                                    Изменить
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Модалка редактирования ОБЛОЖКИ */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="text-xl font-bold">Обложка: {editingCategory.name}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-800 text-2xl leading-none">&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            
                            {/* Информационный блок */}
                            <div className="bg-blue-50 text-blue-800 p-4 rounded text-sm">
                                Название и ссылка этой категории защищены от изменения. Вы можете обновить только фотографию обложки.
                            </div>

                            {/* Поле для картинки */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Загрузить новую фотографию</label>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    required // Сделаем поле обязательным, раз уж мы редактируем только его
                                    onChange={e => setFormData({...formData, image: e.target.files[0]})} 
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" 
                                />
                            </div>

                            <div className="mt-8 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded">Отмена</button>
                                <button type="submit" className="px-6 py-2 text-white bg-primary rounded font-medium hover:bg-primary/90">Сохранить обложку</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryList;