import React, { useState, useEffect } from 'react';

const ProductManager = ({ subcategoryId }) => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Состояния формы и модалки
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null); // null = режим создания
    
    // Состояние данных формы
    const [formData, setFormData] = useState({
        name: '', sku: '', price: '', old_price: '', description: '', is_published: true,
        images: [] // Файлы для загрузки при создании
    });
    
    // Состояние для УЖЕ загруженных картинок (для режима редактирования)
    const [existingImages, setExistingImages] = useState([]);

    // --- 1. ЗАГРУЗКА ДАННЫХ ---
    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/admin/subcategories/${subcategoryId}/products`, { credentials: 'include' });
            const data = await response.json();
            setProducts(data);
        } catch (error) { console.error(error); } 
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchProducts(); }, [subcategoryId]);

    // --- 2. ОТКРЫТИЕ ФОРМЫ РЕДАКТИРОВАНИЯ ---
    const handleEditClick = async (id) => {
        // Сначала получаем полные данные товара с бэкенда
        try {
            const response = await fetch(`/api/admin/products/${id}`, { credentials: 'include' });
            if (response.ok) {
                const product = await response.json();
                
                // Заполняем форму
                setFormData({
                    name: product.name,
                    sku: product.sku || '',
                    price: product.price,
                    old_price: product.old_price || '',
                    description: product.description || '',
                    is_published: product.is_published === 1,
                    images: [] // Сбрасываем выбранные новые файлы
                });
                
                setExistingImages(product.images || []); // Кладем существующие картинки отдельно
                setEditingProductId(product.id);
                setIsModalOpen(true);
            }
        } catch (error) {
            console.error("Ошибка загрузки товара для редактирования", error);
        }
    };

    // Очистка формы при закрытии/создании
    const resetForm = () => {
        setFormData({ name: '', sku: '', price: '', old_price: '', description: '', is_published: true, images: [] });
        setExistingImages([]);
        setEditingProductId(null);
    };

    // --- 3. ОТПРАВКА ФОРМЫ (Создание ИЛИ Обновление) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            if (editingProductId) {
                // РЕЖИМ ОБНОВЛЕНИЯ (PUT)
                // Отправляем текстовые данные
                const textResponse = await fetch(`/api/admin/products/${editingProductId}`, {
                    method: 'PUT',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                // Если выбрали НОВЫЕ файлы, отправляем их отдельным запросом
                if (textResponse.ok && formData.images.length > 0) {
                    const imgData = new FormData();
                    for (let i = 0; i < formData.images.length; i++) imgData.append('images', formData.images[i]);
                    await fetch(`/api/admin/products/${editingProductId}/images`, {
                        method: 'POST', credentials: 'include', body: imgData,
                    });
                }
            } else {
                // РЕЖИМ СОЗДАНИЯ (POST) - все в одном запросе
                const data = new FormData();
                data.append('subcategory_id', subcategoryId);
                Object.keys(formData).forEach(key => {
                    if (key !== 'images' && formData[key] !== null) data.append(key, key === 'is_published' ? (formData[key] ? '1' : '') : formData[key]);
                });
                for (let i = 0; i < formData.images.length; i++) data.append('images', formData.images[i]);

                await fetch('/api/admin/products', {
                    method: 'POST', credentials: 'include', body: data,
                });
            }

            setIsModalOpen(false);
            resetForm();
            fetchProducts();
        } catch (error) {
            console.error(error);
            alert('Ошибка сети при сохранении');
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- 4. УДАЛЕНИЕ СУЩЕСТВУЮЩЕГО ФОТО ---
    const handleDeleteImage = async (imageId) => {
        if (!window.confirm("Удалить эту фотографию навсегда?")) return;
        try {
            const response = await fetch(`/api/admin/images/${imageId}`, { method: 'DELETE', credentials: 'include' });
            if (response.ok) {
                // Убираем картинку из интерфейса, не перезагружая всю форму
                setExistingImages(prev => prev.filter(img => img.id !== imageId));
            }
        } catch (error) { console.error("Ошибка при удалении фото", error); }
    };

    // Удаление товара (без изменений)
    const handleDeleteProduct = async (id, name) => {
        if (!window.confirm(`Вы уверены, что хотите удалить платье "${name}"?`)) return;
        try {
            const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE', credentials: 'include' });
            if (res.ok) fetchProducts();
        } catch (error) { console.error(error); }
    };

    if (isLoading) return <div>Загрузка платьев...</div>;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Шапка таблицы */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-bold text-gray-800">Список платьев</h2>
                <button 
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors text-sm font-medium"
                >
                    + Добавить платье
                </button>
            </div>

            {/* Таблица */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600 text-xs uppercase tracking-wider">
                            <th className="p-4 border-b">Фото</th>
                            <th className="p-4 border-b">Артикул</th>
                            <th className="p-4 border-b">Название</th>
                            <th className="p-4 border-b">Цена</th>
                            <th className="p-4 border-b text-center">Статус</th>
                            <th className="p-4 border-b text-right">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 && (
                            <tr><td colSpan="6" className="p-8 text-center text-gray-500">Здесь пока нет товаров</td></tr>
                        )}
                        {products.map(product => (
                            <tr key={product.id} className={`border-b transition-colors hover:bg-gray-50 ${!product.is_published ? 'opacity-60' : ''}`}>
                                <td className="p-4">
                                    <div className="w-12 h-16 bg-gray-200 rounded overflow-hidden">
                                        {product.main_image && <img src={`/images/${product.main_image}`} alt={product.name} className="w-full h-full object-cover" />}
                                    </div>
                                </td>
                                <td className="p-4 text-gray-500 font-mono text-sm">{product.sku}</td>
                                <td className="p-4 font-semibold text-gray-800">{product.name}</td>
                                <td className="p-4 text-primary font-medium">{product.price} ₽</td>
                                <td className="p-4 text-center">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${product.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {product.is_published ? 'Опубликовано' : 'Черновик'}
                                    </span>
                                </td>
                                <td className="p-4 text-right space-x-3">
                                    <button onClick={() => handleEditClick(product.id)} className="text-blue-500 hover:text-blue-700 text-sm font-medium">Редактировать</button>
                                    <button onClick={() => handleDeleteProduct(product.id, product.name)} className="text-red-500 hover:text-red-700 text-sm font-medium">Удалить</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* МОДАЛЬНОЕ ОКНО (УНИВЕРСАЛЬНОЕ) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl my-8">
                        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white rounded-t-xl z-10">
                            <h3 className="text-xl font-bold text-gray-800">
                                {editingProductId ? `Редактирование: ${formData.name}` : 'Новое платье'}
                            </h3>
                            <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="text-gray-400 hover:text-gray-800 text-2xl">&times;</button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {/* ... (Текстовые поля остались без изменений) ... */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Название *</label>
                                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-md p-2.5 outline-none focus:ring-2 focus:ring-primary/50" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Артикул</label>
                                    <input type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full border border-gray-300 rounded-md p-2.5 outline-none focus:ring-2 focus:ring-primary/50" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Цена (₽) *</label>
                                    <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border border-gray-300 rounded-md p-2.5 outline-none focus:ring-2 focus:ring-primary/50" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Старая цена (₽, для скидки)</label>
                                    <input type="number" value={formData.old_price} onChange={e => setFormData({...formData, old_price: e.target.value})} className="w-full border border-gray-300 rounded-md p-2.5 outline-none focus:ring-2 focus:ring-primary/50" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                                <textarea rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border border-gray-300 rounded-md p-2.5 outline-none focus:ring-2 focus:ring-primary/50"></textarea>
                            </div>

                            {/* --- БЛОК ИЗОБРАЖЕНИЙ --- */}
                            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                                <label className="block text-sm font-bold text-gray-700 mb-4">Фотографии</label>
                                
                                {/* Галерея УЖЕ загруженных фото (только в режиме редактирования) */}
                                {existingImages.length > 0 && (
                                    <div className="flex flex-wrap gap-4 mb-6">
                                        {existingImages.map(img => (
                                            <div key={img.id} className="relative w-24 h-32 bg-white rounded border overflow-hidden group">
                                                <img src={`/images/${img.filename}`} alt="" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button 
                                                        type="button" 
                                                        onClick={() => handleDeleteImage(img.id)}
                                                        className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 shadow-lg"
                                                        title="Удалить фото"
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Инпут для загрузки новых */}
                                <div className="border-2 border-dashed border-gray-300 p-4 rounded bg-white">
                                    <p className="text-sm text-gray-600 mb-2">
                                        {editingProductId ? 'Загрузить дополнительные фото:' : 'Выберите фотографии для нового платья (первое станет главным):'}
                                    </p>
                                    <input 
                                        type="file" multiple accept="image/*" 
                                        onChange={e => setFormData({ ...formData, images: Array.from(e.target.files) })} 
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" 
                                    />
                                    {formData.images.length > 0 && (
                                        <p className="text-sm text-green-600 mt-2 font-medium">Готово к загрузке: {formData.images.length} файл(ов)</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input type="checkbox" id="is_published" checked={formData.is_published} onChange={e => setFormData({...formData, is_published: e.target.checked})} className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded" />
                                <label htmlFor="is_published" className="text-sm font-medium text-gray-800">Опубликовать на сайте</label>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t mt-6">
                                <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition-colors">Отмена</button>
                                <button type="submit" disabled={isSubmitting} className={`px-5 py-2.5 text-white rounded-md font-medium transition-colors ${isSubmitting ? 'bg-primary/50 cursor-wait' : 'bg-primary hover:bg-primary/90'}`}>
                                    {isSubmitting ? 'Сохранение...' : (editingProductId ? 'Сохранить изменения' : 'Создать платье')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManager;