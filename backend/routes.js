const express = require("express");
const db = require("./admin");
const fs = require("fs");
const path = require("path");
const authMiddleware = require("./middleware/authMiddleware");
const { uploadSingle, uploadMultiple, optimizeImage } = require("./upload");

const router = express.Router();

// Все роуты ниже защищены: только для авторизованных
router.use(authMiddleware);

const handleMulterUpload = (uploadMiddleware) => (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
        if (err) {
            // Если ошибка от Multer (превышен размер или количество)
            if (err.name === 'MulterError') {
                if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: "Файл слишком большой (максимум 10 МБ)" });
                if (err.code === 'LIMIT_UNEXPECTED_FILE') return res.status(400).json({ error: "Слишком много файлов за один раз (максимум 10)" });
                return res.status(400).json({ error: err.message });
            }
            // Если наша кастомная ошибка (не картинка)
            return res.status(400).json({ error: err.message });
        }
        next();
    });
};

// ==========================================
// КАТЕГОРИИ
// ==========================================

router.get("/categories", (req, res) => {
    try {
        const categories = db.getAllCategories();
        res.json(categories);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/categories", handleMulterUpload(uploadSingle), optimizeImage, (req, res) => {
    try {
        const { name, slug, description } = req.body;
        const coverImage = req.optimizedFilenames ? req.optimizedFilenames[0] : null;
        db.createCategory(name, slug, description, coverImage);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put("/categories/:id", handleMulterUpload(uploadSingle), optimizeImage, (req, res) => {
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

router.post("/subcategories", handleMulterUpload(uploadSingle), optimizeImage, (req, res) => {
    try {
        const { category_id, name, slug, seo_text } = req.body;
        const coverImage = req.optimizedFilenames ? req.optimizedFilenames[0] : null;
        db.createSubcategory(category_id, name, slug, seo_text, coverImage);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put("/subcategories/:id", handleMulterUpload(uploadSingle), optimizeImage, (req, res) => {
    try {
        const { name, slug, seo_text } = req.body;
        const coverImage = req.optimizedFilenames ? req.optimizedFilenames[0] : null;
        db.updateSubcategory(req.params.id, name, slug, seo_text, coverImage);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/subcategories/:id", (req, res) => {
    try {
        // Получаем массив файлов "на удаление" (обложка + все фото всех платьев внутри)
        const filesToDelete = db.deleteSubcategoryAndFiles(req.params.id);
        
        // Физически стираем файлы с диска
        filesToDelete.forEach(filename => {
            fs.unlink(path.join(__dirname, "static", filename), (err) => {
                if (err) console.error("Не удалось удалить файл:", filename, err);
            });
        });

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
router.post("/products", handleMulterUpload(uploadMultiple), optimizeImage, (req, res) => {
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
        // Получаем массив всех фото этого платья
        const filesToDelete = db.deleteProductAndFiles(req.params.id);
        
        // Физически стираем их с диска
        filesToDelete.forEach(filename => {
            fs.unlink(path.join(__dirname, "static", filename), (err) => {
                if (err) console.error("Не удалось удалить файл:", filename, err);
            });
        });

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

// ==========================================
// ОТЗЫВЫ (СКРИНШОТЫ)
// ==========================================

router.get("/reviews", (req, res) => {
    try { res.json(db.getAllReviews()); } 
    catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/reviews", handleMulterUpload(uploadMultiple), optimizeImage, (req, res) => {
    try {
        if (req.optimizedFilenames && req.optimizedFilenames.length > 0) {
            db.addReviews(req.optimizedFilenames);
            res.json({ success: true });
        } else {
            res.status(400).json({ error: "Файлы не загружены" });
        }
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/reviews/:id", (req, res) => {
    try {
        const item = db.deleteReview(req.params.id);
        if (item) {
            fs.unlink(path.join(__dirname, "static", item.filename), (err) => {
                if (err) console.error("Ошибка удаления файла:", err);
            });
        }
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// НАШИ НЕВЕСТЫ (ГАЛЕРЕЯ)
// ==========================================

// Логика абсолютно идентична отзывам
router.get("/brides", (req, res) => {
    try { res.json(db.getAllBrides()); } 
    catch (err) { res.status(500).json({ error: err.message }); }
});

router.post("/brides", handleMulterUpload(uploadMultiple), optimizeImage, (req, res) => {
    try {
        if (req.optimizedFilenames && req.optimizedFilenames.length > 0) {
            db.addBrides(req.optimizedFilenames);
            res.json({ success: true });
        } else {
            res.status(400).json({ error: "Файлы не загружены" });
        }
    } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete("/brides/:id", (req, res) => {
    try {
        const item = db.deleteBride(req.params.id);
        if (item) {
            fs.unlink(path.join(__dirname, "static", item.filename), (err) => {
                if (err) console.error("Ошибка удаления файла:", err);
            });
        }
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;