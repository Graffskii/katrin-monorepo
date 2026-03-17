import React, { useState, useEffect } from 'react';

const SubcategoryList = ({ categoryId, onSelectSubcategory }) => {
    const [subcategories, setSubcategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Состояние для модального окна
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '', slug: '', seo_text: '', image: null,
        current_cover_image: null
    });

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

    const handleEditClick = (sub) => {
        setFormData({
            name: sub.name,
            slug: sub.slug,
            seo_text: sub.seo_text || '',
            image: null, // Новую картинку пока не выбрали
            current_cover_image: sub.cover_image
        });
        setEditingId(sub.id);
        setIsModalOpen(true);
    };

    // Очистка формы
    const resetForm = () => {
        setFormData({ name: '', slug: '', seo_text: '', image: null, current_cover_image: null });
        setEditingId(null);
        setIsModalOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('slug', formData.slug);
        data.append('seo_text', formData.seo_text);
        if (formData.image) data.append('image', formData.image);

        // category_id нужен только при создании
        if (!editingId) data.append('category_id', categoryId);

        try {
            const url = editingId ? `/api/admin/subcategories/${editingId}` : '/api/admin/subcategories';
            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                credentials: 'include',
                body: data,
            });

            if (response.ok) {
                resetForm();
                fetchSubcategories();
            } else {
                alert('Ошибка при сохранении');
            }
        } catch (error) { console.error(error); }
    };

    const handleDeleteClick = async (id, name) => {
        if (!window.confirm(`ВНИМАНИЕ! Вы уверены, что хотите удалить раздел "${name}"? ВСЕ ПЛАТЬЯ в этом разделе также будут удалены навсегда!`)) return;

        try {
            const response = await fetch(`/api/admin/subcategories/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (response.ok) fetchSubcategories();
        } catch (error) { console.error(error); }
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
                                    <button onClick={() => handleEditClick(sub)} className="text-gray-500 hover:text-blue-500 text-sm font-medium">
                                        Изменить
                                    </button>
                                    <button onClick={() => handleDeleteClick(sub.id, sub.name)} className="text-gray-500 hover:text-red-500 text-sm font-medium">
                                        Удалить
                                    </button>
                                    <button onClick={() => onSelectSubcategory(sub)} className="bg-primary/10 text-primary px-4 py-2 rounded text-sm font-semibold">
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
                                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border border-gray-300 rounded p-2 focus:ring-primary focus:border-primary outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">URL / Slug (на английском: puffy)</label>
                                <input required type="text" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} className="w-full border border-gray-300 rounded p-2 focus:ring-primary focus:border-primary outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Текст (описание снизу)</label>
                                <textarea rows="3" value={formData.seo_text} onChange={e => setFormData({ ...formData, seo_text: e.target.value })} className="w-full border border-gray-300 rounded p-2 focus:ring-primary focus:border-primary outline-none"></textarea>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                                <label className="block text-sm font-bold text-gray-700 mb-4">Обложка раздела</label>

                                {/* --- ПРЕВЬЮ ТЕКУЩЕЙ ОБЛОЖКИ (только при редактировании) --- */}
                                {editingId && formData.current_cover_image && (
                                    <div className="mb-4">
                                        <p className="text-xs text-gray-500 mb-2">Текущая обложка:</p>
                                        <div className="w-24 h-32 rounded border overflow-hidden">
                                            <img src={`/images/${formData.current_cover_image}`} alt="Текущая обложка" className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                )}

                                <div className="border-2 border-dashed border-gray-300 p-4 rounded bg-white">
                                    <p className="text-sm text-gray-600 mb-2">
                                        {editingId ? 'Загрузить новую обложку (заменит старую):' : 'Выберите фотографию для обложки:'}
                                    </p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        required={!editingId} // <--- ФАЙЛ ОБЯЗАТЕЛЕН ТОЛЬКО ПРИ СОЗДАНИИ
                                        onChange={e => setFormData({ ...formData, image: e.target.files[0] })}
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded">Отмена</button>
                                <button type="submit" className="bg-primary text-white px-4 py-2 rounded">
                                    {editingId ? 'Сохранить изменения' : 'Создать'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubcategoryList;