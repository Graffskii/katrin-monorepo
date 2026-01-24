import React, { createContext, useContext, useState, useEffect } from 'react';

// Создаем контекст с null в качестве значения по умолчанию
const FavoritesContext = createContext(null);

// Создаем кастомный хук, который будет проверять, используется ли он внутри провайдера
export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (context === null) {
        throw new Error("useFavorites должен использоваться внутри FavoritesProvider");
    }
    return context;
};

const getInitialFavorites = () => {
    try {
        const storedFavorites = localStorage.getItem('favorites');
        return storedFavorites ? JSON.parse(storedFavorites) : [];
    } catch (error) {
        console.error("Ошибка чтения избранного из localStorage:", error);
        return [];
    }
};

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState(getInitialFavorites);

    useEffect(() => {
        try {
            localStorage.setItem('favorites', JSON.stringify(favorites));
        } catch (error) {
            console.error("Ошибка записи избранного в localStorage:", error);
        }
    }, [favorites]);

    const toggleFavorite = (productId) => {
        setFavorites(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const isFavorite = (productId) => {
        return favorites.includes(productId);
    };

    const value = {
        favorites,
        toggleFavorite,
        isFavorite,
        favoritesCount: favorites.length
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};