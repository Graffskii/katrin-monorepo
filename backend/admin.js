const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');

function createDatabase(dbPath = 'db.sqlite') {
  // Инициализация. В better-sqlite3 это происходит синхронно.
  const db = new Database(dbPath);
  
  // Включаем внешние ключи
  db.pragma('foreign_keys = ON');

  // --- 1. СОЗДАНИЕ СТРУКТУРЫ ---
  function createTables() {
    // db.exec выполняет несколько запросов за раз
    db.exec(`
        CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL CHECK(role IN ('admin', 'moderator'))
        );
        
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            cover_image TEXT,
            description TEXT,
            seo_text TEXT
        );

        CREATE TABLE IF NOT EXISTS subcategories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category_id INTEGER,
            name TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            cover_image TEXT,
            seo_text TEXT,
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subcategory_id INTEGER,
            name TEXT NOT NULL,
            sku TEXT,
            description TEXT,
            price REAL NOT NULL,
            old_price REAL,
            is_published BOOLEAN DEFAULT 1,
            FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS product_images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER,
            filename TEXT NOT NULL,
            sort_order INTEGER DEFAULT 0,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL,
            sort_order INTEGER DEFAULT 0,
            is_published BOOLEAN DEFAULT 1
        );

        CREATE TABLE IF NOT EXISTS brides_gallery (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL,
            sort_order INTEGER DEFAULT 0,
            is_published BOOLEAN DEFAULT 1
        );
    `);
  }

  // Создаем таблицы сразу
  createTables();

  // --- 2. ФУНКЦИИ ДЛЯ АДМИНОВ ---
  function getAdmin(username) {
      // .prepare компилирует запрос, .get выполняет и возвращает 1 строку (или undefined)
      const stmt = db.prepare("SELECT * FROM admins WHERE username = ?");
      return stmt.get(username); 
  }
  
  // Эта функция остается асинхронной, так как bcrypt.hash работает асинхронно
  async function addAdmin(username, password, role = "moderator") {
      const hashedPassword = await bcrypt.hash(password, 10);
      const stmt = db.prepare("INSERT INTO admins (username, password, role) VALUES (?, ?, ?)");
      stmt.run(username, hashedPassword, role); // .run для INSERT/UPDATE/DELETE
  }

  // --- 3. ФУНКЦИИ ДЛЯ ПУБЛИЧНОГО API ---

  function getCatalogStructure() {
      const stmt = db.prepare(`
          SELECT 
              c.id as category_id, c.name as category_name, c.slug as category_slug, c.cover_image as category_cover_image,
              s.id as subcategory_id, s.name as subcategory_name, s.slug as subcategory_slug, s.cover_image as subcategory_cover_image
          FROM categories c
          LEFT JOIN subcategories s ON c.id = s.category_id
          ORDER BY c.id, s.id;
      `);
      const rows = stmt.all(); // .all возвращает массив всех строк

      const structure = {};
      rows.forEach(row => {
          if (!structure[row.category_id]) {
              structure[row.category_id] = {
                  id: row.category_id,
                  name: row.category_name,
                  slug: row.category_slug,
                  cover_image: row.category_cover_image,
                  subcategories: []
              };
          }
          if (row.subcategory_id) {
              structure[row.category_id].subcategories.push({
                  id: row.subcategory_id,
                  name: row.subcategory_name,
                  slug: row.subcategory_slug,
                  cover_image: row.subcategory_cover_image
              });
          }
      });
      return Object.values(structure);
  }

  function getSubCategoryWithProducts(slug) {
      const subcategoryStmt = db.prepare(`
          SELECT 
              s.*,
              c.name as category_name,
              c.slug as category_slug
          FROM subcategories s
          JOIN categories c ON s.category_id = c.id
          WHERE s.slug = ?
      `);
      const subcategory = subcategoryStmt.get(slug);

      if (!subcategory) return null;

      const productsStmt = db.prepare(`
          SELECT 
              p.*,
              (SELECT filename FROM product_images WHERE product_id = p.id ORDER BY sort_order ASC LIMIT 1) as main_image
          FROM products p
          WHERE p.subcategory_id = ? AND p.is_published = 1
      `);
      subcategory.products = productsStmt.all(subcategory.id);

      return subcategory;
  }

  function getProductDetails(productId) {
      const productStmt = db.prepare(`
          SELECT
              p.*,
              s.name as subcategory_name,
              s.slug as subcategory_slug,
              c.name as category_name,
              c.slug as category_slug
          FROM products p
          LEFT JOIN subcategories s ON p.subcategory_id = s.id
          LEFT JOIN categories c ON s.category_id = c.id
          WHERE p.id = ? AND p.is_published = 1
      `);
      const product = productStmt.get(productId);

      if (!product) return null;

      const imagesStmt = db.prepare("SELECT filename FROM product_images WHERE product_id = ? ORDER BY sort_order ASC");
      const images = imagesStmt.all(productId);
      product.images = images.map(img => img.filename);

      return product;
  }

  function getPublishedReviews() {
      return db.prepare("SELECT * FROM reviews WHERE is_published = 1 ORDER BY sort_order ASC, id DESC").all();
  }

  function getPublishedBrides() {
      return db.prepare("SELECT * FROM brides_gallery WHERE is_published = 1 ORDER BY sort_order ASC, id DESC").all();
  }

  // --- ФУНКЦИИ ДЛЯ АДМИН-ПАНЕЛИ (CRUD) ---

  // === КАТЕГОРИИ ===
  function getAllCategories() {
    return db.prepare("SELECT * FROM categories ORDER BY id DESC").all();
}

function createCategory(name, slug, description, coverImage) {
    const stmt = db.prepare("INSERT INTO categories (name, slug, description, cover_image) VALUES (?, ?, ?, ?)");
    return stmt.run(name, slug, description, coverImage);
}

function updateCategory(id, name, slug, description, coverImage) {
    // Если coverImage не передан (не загружали новую картинку), обновляем без него
    if (coverImage) {
        const stmt = db.prepare("UPDATE categories SET name = ?, slug = ?, description = ?, cover_image = ? WHERE id = ?");
        return stmt.run(name, slug, description, coverImage, id);
    } else {
        const stmt = db.prepare("UPDATE categories SET name = ?, slug = ?, description = ? WHERE id = ?");
        return stmt.run(name, slug, description, id);
    }
}

function deleteCategory(id) {
    // ON DELETE CASCADE в БД автоматически удалит подкатегории и товары
    const stmt = db.prepare("DELETE FROM categories WHERE id = ?");
    return stmt.run(id);
}

// === ПОДКАТЕГОРИИ ===
function getSubcategoriesByCategory(categoryId) {
    return db.prepare("SELECT * FROM subcategories WHERE category_id = ? ORDER BY id DESC").all(categoryId);
}

function createSubcategory(categoryId, name, slug, seoText, coverImage) {
    const stmt = db.prepare("INSERT INTO subcategories (category_id, name, slug, seo_text, cover_image) VALUES (?, ?, ?, ?, ?)");
    return stmt.run(categoryId, name, slug, seoText, coverImage);
}

function updateSubcategory(id, name, slug, seoText, coverImage) {
    if (coverImage) {
        const stmt = db.prepare("UPDATE subcategories SET name = ?, slug = ?, seo_text = ?, cover_image = ? WHERE id = ?");
        return stmt.run(name, slug, seoText, coverImage, id);
    } else {
        const stmt = db.prepare("UPDATE subcategories SET name = ?, slug = ?, seo_text = ? WHERE id = ?");
        return stmt.run(name, slug, seoText, id);
    }
}

function deleteSubcategory(id) {
    const stmt = db.prepare("DELETE FROM subcategories WHERE id = ?");
    return stmt.run(id);
}

// === ТОВАРЫ ===
function getProductsBySubcategory(subcategoryId) {
    // Получаем товары и приклеиваем к ним главное фото для админки
    const stmt = db.prepare(`
        SELECT p.*, 
               (SELECT filename FROM product_images WHERE product_id = p.id ORDER BY sort_order ASC LIMIT 1) as main_image
        FROM products p 
        WHERE subcategory_id = ? 
        ORDER BY id DESC
    `);
    return stmt.all(subcategoryId);
}

function createProduct(data) {
    const { subcategory_id, name, sku, description, price, old_price, is_published } = data;
    const stmt = db.prepare(`
        INSERT INTO products (subcategory_id, name, sku, description, price, old_price, is_published) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    // Выполняем запрос и сразу возвращаем ID созданного товара (понадобится для привязки фото)
    const result = stmt.run(subcategory_id, name, sku, description, price, old_price, is_published ? 1 : 0);
    return result.lastInsertRowid; 
}

function updateProduct(id, data) {
    const { name, sku, description, price, old_price, is_published } = data;
    const stmt = db.prepare(`
        UPDATE products 
        SET name = ?, sku = ?, description = ?, price = ?, old_price = ?, is_published = ? 
        WHERE id = ?
    `);
    return stmt.run(name, sku, description, price, old_price, is_published ? 1 : 0, id);
}

function deleteProduct(id) {
    const stmt = db.prepare("DELETE FROM products WHERE id = ?");
    return stmt.run(id);
}

function addProductImages(productId, filenames) {
    const stmt = db.prepare("INSERT INTO product_images (product_id, filename) VALUES (?, ?)");
    // Используем транзакцию для быстрой вставки нескольких картинок
    const insertMany = db.transaction((imgs) => {
        for (const file of imgs) stmt.run(productId, file);
    });
    insertMany(filenames);
}

function getProductImage(imageId) {
  return db.prepare("SELECT filename FROM product_images WHERE id = ?").get(imageId);
}

function deleteProductImage(imageId) {
  return db.prepare("DELETE FROM product_images WHERE id = ?").run(imageId);
}

// Получить полные данные товара для админки (включая ID картинок)
function getProductForAdmin(productId) {
  const product = db.prepare("SELECT * FROM products WHERE id = ?").get(productId);
  if (!product) return null;

  // Получаем объекты картинок (с ID), а не просто имена файлов
  product.images = db.prepare("SELECT id, filename, sort_order FROM product_images WHERE product_id = ? ORDER BY sort_order ASC").all(productId);
  return product;
}

  return {
    db,
    createTables,
    getAdmin,
    addAdmin,
    getCatalogStructure,
    getSubCategoryWithProducts,
    getProductDetails,
    getPublishedReviews,
    getPublishedBrides,
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getSubcategoriesByCategory,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
    getProductsBySubcategory,
    createProduct,
    updateProduct,
    deleteProduct,
    addProductImages,
    getProductImage,
    deleteProductImage,
    getProductForAdmin
  };
}

module.exports = createDatabase();
module.exports.createDatabase = createDatabase;