// backend/catalogRoutes.js
const express = require("express");
const db = require("./admin"); // Импортируем наш модуль с функциями БД

const router = express.Router();

// GET /api/catalog/structure - получить всю структуру категорий для меню
router.get("/structure", async (req, res) => {
    try {
        const structure = await db.getCatalogStructure();
        res.json(structure);
    } catch (error) {
        console.error("Ошибка при получении структуры каталога:", error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// GET /api/catalog/subcategory/:slug - получить подкатегорию с товарами
router.get("/subcategory/:slug", async (req, res) => {
    try {
        const subcategory = await db.getSubCategoryWithProducts(req.params.slug);
        if (!subcategory) {
            return res.status(404).json({ error: "Подкатегория не найдена" });
        }
        res.json(subcategory);
    } catch (error) {
        console.error(`Ошибка при получении подкатегории ${req.params.slug}:`, error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});

// GET /api/catalog/product/:id - получить детальную информацию о товаре
router.get("/product/:id", async (req, res) => {
    try {
        const product = await db.getProductDetails(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Товар не найден" });
        }
        res.json(product);
    } catch (error) {
        console.error(`Ошибка при получении товара ${req.params.id}:`, error);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});


module.exports = router;