const express = require("express");
const db = require("./admin");
const authMiddleware = require("./middleware/authMiddleware");
const { uploadSingle, uploadMultiple, optimizeImage } = require("./upload");

const router = express.Router();

// Все роуты ниже защищены: только для авторизованных
router.use(authMiddleware);

// ==========================================
// КАТЕГОРИИ
// ==========================================

router.get("/categories", (req, res) => {
    try {
        const categories = db.getAllCategories();
        res.json(categories);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/categories", uploadSingle, optimizeImage, (req, res) => {
    try {
        const { name, slug, description } = req.body;
        const coverImage = req.optimizedFilenames ? req.optimizedFilenames[0] : null;
        db.createCategory(name, slug, description, coverImage);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put("/categories/:id", uploadSingle, optimizeImage, (req, res) => {
    try {
        const { name, slug, description } = req.body;
        const coverImage = req.optimizedFilenames ? req.optimizedFilenames[0] : null;
        db.updateCategory(req.params.id, name, slug, description, coverImage);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/categories/:id", (req, res) => {
    try {
        db.deleteCategory(req.params.id);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// ПОДКАТЕГОРИИ
// ==========================================

router.get("/categories/:categoryId/subcategories", (req, res) => {
    try {
        const subs = db.getSubcategoriesByCategory(req.params.categoryId);
        res.json(subs);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/subcategories", uploadSingle, optimizeImage, (req, res) => {
    try {
        const { category_id, name, slug, seo_text } = req.body;
        const coverImage = req.optimizedFilenames ? req.optimizedFilenames[0] : null;
        db.createSubcategory(category_id, name, slug, seo_text, coverImage);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put("/subcategories/:id", uploadSingle, optimizeImage, (req, res) => {
    try {
        const { name, slug, seo_text } = req.body;
        const coverImage = req.optimizedFilenames ? req.optimizedFilenames[0] : null;
        db.updateSubcategory(req.params.id, name, slug, seo_text, coverImage);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/subcategories/:id", (req, res) => {
    try {
        db.deleteSubcategory(req.params.id);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// ТОВАРЫ (ПЛАТЬЯ)
// ==========================================

router.get("/subcategories/:subcategoryId/products", (req, res) => {
    try {
        const products = db.getProductsBySubcategory(req.params.subcategoryId);
        res.json(products);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Получить один товар для формы редактирования
router.get("/products/:id", (req, res) => {
    try {
        const product = db.getProductForAdmin(req.params.id);
        if (!product) return res.status(404).json({ error: "Товар не найден" });
        res.json(product);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Обратите внимание: тут мы используем uploadMultiple (до 10 фото за раз)
router.post("/products", uploadMultiple, optimizeImage, (req, res) => {
    try {
        // 1. Создаем запись о товаре в БД
        const productId = db.createProduct(req.body);
        
        // 2. Если были загружены картинки, привязываем их к этому товару
        if (req.optimizedFilenames && req.optimizedFilenames.length > 0) {
            db.addProductImages(productId, req.optimizedFilenames);
        }
        res.json({ success: true, id: productId });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put("/products/:id", (req, res) => {
    try {
        db.updateProduct(req.params.id, req.body);
        // Загрузку новых фото для существующего товара лучше сделать отдельным роутом позже
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/products/:id", (req, res) => {
    try {
        db.deleteProduct(req.params.id);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Добавить новые фото к существующему товару
router.post("/products/:id/images", uploadMultiple, optimizeImage, (req, res) => {
    try {
        if (req.optimizedFilenames && req.optimizedFilenames.length > 0) {
            db.addProductImages(req.params.id, req.optimizedFilenames);
            res.json({ success: true });
        } else {
            res.status(400).json({ error: "Файлы не загружены" });
        }
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Удалить одно фото
router.delete("/images/:imageId", (req, res) => {
    try {
        // Сначала узнаем имя файла, чтобы удалить его с диска
        const image = db.getProductImage(req.params.imageId);
        if (image) {
            const filePath = path.join(__dirname, "static", image.filename);
            // Удаляем файл асинхронно, не блокируя сервер
            fs.unlink(filePath, (err) => {
                if (err) console.error("Ошибка удаления файла с диска:", err);
            });
            // Удаляем запись из БД
            db.deleteProductImage(req.params.imageId);
        }
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;