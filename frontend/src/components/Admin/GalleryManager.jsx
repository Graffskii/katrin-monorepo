import React, { useState, useEffect } from 'react';

const GalleryManager = () => {
    const [gallery, setGallery] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [updatedGallery, setUpdatedGallery] = useState([]);

    const handleInputChange = (e, id, field) => {
        const updatedData = gallery.map(item => {
            if (item.id === id) {
                return { ...item, [field]: e.target.value };
            }
            return item;
        });
        setUpdatedGallery(updatedData); // обновляем локальное состояние
    };

    const handleSave = async (id) => {
        const itemToSave = updatedGallery.find(item => item.id === id);

        if (!itemToSave) return;

        const formData = new URLSearchParams();
        formData.append('id', itemToSave.id);
        formData.append('caption', itemToSave.caption);
        formData.append('category', itemToSave.category);

        try {
            const response = await fetch('/api/admin/edit', {
                method: 'POST',
                credentials: 'include',
                body: formData,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            if (response.ok) {
                alert('Изменения сохранены');
                fetchGallery(); // Обновляем галерею
            } else {
                alert('Ошибка при сохранении изменений');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при сохранении изменений');
        }
    };


    // Загрузка данных галереи
    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            const response = await fetch('/api/admin', {
                credentials: "include",
            });
            if (!response.ok) {
                throw new Error('Не удалось загрузить галерею');
            }
            const data = await response.json();
            setGallery(data.gallery);
            setError(null);
        } catch (err) {
            console.error('Ошибка загрузки галереи:', err);
            setError('Не удалось загрузить изображения');
        } finally {
            setLoading(false);
        }
    };

    // Обработчики действий
    const handleSetDraft = async (id) => {
        try {
            const response = await fetch('/api/admin/set-draft', {
                method: 'POST',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `id=${id}`,
            });

            if (response.ok) {
                alert('Статус изменен');
                fetchGallery(); // Обновляем галерею
            } else {
                alert('Ошибка при изменении статуса');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при изменении статуса');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Вы уверены, что хотите удалить это изображение?')) {
            return;
        }

        try {
            const response = await fetch('/api/admin/delete', {
                method: 'POST',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `id=${id}`,
            });

            if (response.ok) {
                alert('Изображение удалено');
                fetchGallery(); // Обновляем галерею
            } else {
                alert('Ошибка при удалении изображения');
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Ошибка при удалении изображения');
        }
    };

    // Статистика
    const stats = {
        total: gallery.length,
        published: gallery.filter(item => !item.draft).length,
        drafts: gallery.filter(item => item.draft).length,
        wedding: gallery.filter(item => item.category === 'Wedding Dresses').length,
        evening: gallery.filter(item => item.category === 'Evening Dresses').length,
        decorations: gallery.filter(item => item.category === 'Decorations').length,
    };

    // Фильтрация для категорий
    console.log(gallery)
    const weddingDresses = gallery.filter(item => item.category === "Wedding Dresses");
    const eveningDresses = gallery.filter(item => item.category === "Evening Dresses");
    const decorations = gallery.filter(item => item.category === "Decorations");

    if (loading) {
        return <div className="text-center mt-8">Загрузка...</div>;
    }

    if (error) {
        return <div className="text-center mt-8 text-red-500">{error}</div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-playfair font-bold mt-8">Галереи</h2>

            {/* Статистика */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
                <div className="bg-blue-50 p-3 rounded-md text-center">
                <p className="text-xs text-gray-500">Всего</p>
                <p className="text-xl font-bold">{stats.total}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-md text-center">
                <p className="text-xs text-gray-500">Опубликовано</p>
                <p className="text-xl font-bold">{stats.published}</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded-md text-center">
                <p className="text-xs text-gray-500">Черновики</p>
                <p className="text-xl font-bold">{stats.drafts}</p>
                </div>
                <div className="bg-pink-50 p-3 rounded-md text-center">
                <p className="text-xs text-gray-500">Свадебные</p>
                <p className="text-xl font-bold">{stats.wedding}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-md text-center">
                <p className="text-xs text-gray-500">Вечерние</p>
                <p className="text-xl font-bold">{stats.evening}</p>
                </div>
                <div className="bg-indigo-50 p-3 rounded-md text-center">
                <p className="text-xs text-gray-500">Декорации</p>
                <p className="text-xl font-bold">{stats.decorations}</p>
                </div>
            </div>

            {/* Свадебные платья */}
            <h3 className="text-xl font-bold mt-4">Свадебные платья</h3>
            <div className="grid md:grid-cols-3 gap-4">
                {weddingDresses.map(item => (
                    <div key={item.id} className="relative border p-4 rounded">
                        <img src={`/api/static/${item.filename}`} alt={item.caption} className="w-full rounded" />
                        <p className="text-center mt-2">{item.caption}</p>
                    </div>
                ))}
            </div>

            {/* Вечерние платья */}
            <h3 className="text-xl font-bold mt-4">Вечерние платья</h3>
            <div className="grid md:grid-cols-3 gap-4">
                {eveningDresses.map(item => (
                    <div key={item.id} className="relative border p-4 rounded">
                        <img src={`/api/static/${item.filename}`} alt={item.caption} className="w-full rounded" />
                        <p className="text-center mt-2">{item.caption}</p>
                    </div>
                ))}
            </div>

            {/* Декорации */}
            <h3 className="text-xl font-bold mt-4">Декорации</h3>
            <div className="grid md:grid-cols-3 gap-4">
                {decorations.map(item => (
                    <div key={item.id} className="relative border p-4 rounded">
                        <img src={`/api/static/${item.filename}`} alt={item.caption} className="w-full rounded" />
                        <p className="text-center mt-2">{item.caption}</p>
                    </div>
                ))}
            </div>

            {/* Таблица для редактирования */}
            <h2 className="text-2xl font-playfair font-bold mt-8">Редактирование фотографий</h2>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2">Фото</th>
                            <th className="border border-gray-300 p-2">Описание</th>
                            <th className="border border-gray-300 p-2">Категория</th>
                            <th className="border border-gray-300 p-2">Статус</th>
                            <th className="border border-gray-300 p-2">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {gallery.map(item => (
                            <tr key={item.id}>
                                <td className="border border-gray-300 p-2 text-center">
                                    <img
                                        src={`/api/static/${item.filename}`}
                                        alt={item.caption}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                </td>
                                <td className="border border-gray-300 p-2">
                                    <input
                                        type="text"
                                        name="caption"
                                        defaultValue={item.caption}
                                        className="border p-1 w-full"
                                        onChange={(e) => handleInputChange(e, item.id, "caption")}
                                    />
                                </td>
                                <td className="border border-gray-300 p-2">
                                    <select
                                        name="category"
                                        defaultValue={item.category}
                                        className="border p-1 w-full"
                                        onChange={(e) => handleInputChange(e, item.id, "category")}
                                    >
                                        <option value="Wedding Dresses">Свадебные платья</option>
                                        <option value="Evening Dresses">Вечерние платья</option>
                                        <option value="Decorations">Декорации</option>
                                    </select>
                                </td>
                                <td className="border border-gray-300 p-2 text-center">
                                    {item.draft ? "Черновик" : "Опубликовано"}
                                </td>
                                <td className="border border-gray-300 p-2 text-center">
                                    <button
                                        type="button"
                                        onClick={() => handleSave(item.id)}
                                        className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition-all"
                                    >
                                        Сохранить
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleSetDraft(item.id)}
                                        className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 transition-all ml-1"
                                    >
                                        В черновик
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(item.id)}
                                        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition-all ml-1"
                                    >
                                        Удалить
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default GalleryManager;