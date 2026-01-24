const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

function createDatabase(dbPath = 'db.sqlite') {
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error("Could not connect to database", err);
    } else {
      console.log("Connected to database");
    }
  });

  // Включаем поддержку внешних ключей (важно для связей таблиц)
  db.exec('PRAGMA foreign_keys = ON;', (err) => {
    if (err) console.error("Could not enable foreign keys:", err);
  });

  // --- 1. СОЗДАНИЕ СТРУКТУРЫ БАЗЫ ДАННЫХ ---
  function createTables(database) {
    return new Promise((resolve, reject) => {
      database.serialize(() => {
        // Таблица администраторов
        database.run(`
          CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL CHECK(role IN ('admin', 'moderator'))
          )
        `);

        // --- НОВЫЕ ТАБЛИЦЫ ДЛЯ КАТАЛОГА V2 ---
        database.run(`
          CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            cover_image TEXT,
            description TEXT
          )
        `);

        database.run(`
          CREATE TABLE IF NOT EXISTS subcategories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category_id INTEGER,
            name TEXT NOT NULL,
            slug TEXT UNIQUE NOT NULL,
            cover_image TEXT,
            FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
          )
        `);

        database.run(`
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
          )
        `);

        database.run(`
          CREATE TABLE IF NOT EXISTS product_images (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER,
            filename TEXT NOT NULL,
            sort_order INTEGER DEFAULT 0,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
          )
        `, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    });
  }

  // Инициализация таблиц при создании объекта
  createTables(db);


  // --- 2. ФУНКЦИИ ДЛЯ АДМИНИСТРАТОРОВ (Аутентификация и Управление) ---

  function getAdmin(username, database = db) {
    return new Promise((resolve, reject) => {
      database.get("SELECT * FROM admins WHERE username = ?", [username], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  async function addAdmin(username, password, role = "moderator", database = db) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return new Promise((resolve, reject) => {
      database.run("INSERT INTO admins (username, password, role) VALUES (?, ?, ?)", [username, hashedPassword, role], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  // --- 3. ФУНКЦИИ ДЛЯ ПУБЛИЧНОГО API КАТАЛОГА (Чтение данных) ---

  /**
   * Получает всю структуру категорий и подкатегорий для меню.
   * Очень эффективный запрос, чтобы избежать множества обращений к БД.
   */
  function getCatalogStructure(database = db) {
    return new Promise((resolve, reject) => {
      // --- ОБНОВЛЕННЫЙ ЗАПРОС ---
      const query = `
            SELECT 
                c.id as category_id, c.name as category_name, c.slug as category_slug, c.cover_image as category_cover_image,
                s.id as subcategory_id, s.name as subcategory_name, s.slug as subcategory_slug, s.cover_image as subcategory_cover_image
            FROM categories c
            LEFT JOIN subcategories s ON c.id = s.category_id
            ORDER BY c.id, s.id;
        `;
      database.all(query, [], (err, rows) => {
        if (err) return reject(err);

        const structure = {};
        rows.forEach(row => {
          if (!structure[row.category_id]) {
            structure[row.category_id] = {
              id: row.category_id,
              name: row.category_name,
              slug: row.category_slug,
              cover_image: row.category_cover_image, // <-- Добавили
              subcategories: []
            };
          }
          if (row.subcategory_id) {
            structure[row.category_id].subcategories.push({
              id: row.subcategory_id,
              name: row.subcategory_name,
              slug: row.subcategory_slug,
              cover_image: row.subcategory_cover_image // <-- Добавили
            });
          }
        });
        resolve(Object.values(structure));
      });
    });
  }

  /**
   * Получает информацию о подкатегории и список всех опубликованных товаров в ней.
   */
  function getSubCategoryWithProducts(slug, database = db) {
    return new Promise((resolve, reject) => {
      const subcategoryQuery = `
            SELECT 
                s.*,
                c.name as category_name,
                c.slug as category_slug
            FROM subcategories s
            JOIN categories c ON s.category_id = c.id
            WHERE s.slug = ?
        `;
      database.get(subcategoryQuery, [slug], (err, subcategory) => {
        if (err) return reject(err);
        if (!subcategory) return resolve(null);

        // --- ИСПРАВЛЕНИЕ ЗДЕСЬ ---
        const productsQuery = `
                SELECT 
                    p.*,
                    (SELECT filename FROM product_images WHERE product_id = p.id ORDER BY sort_order ASC LIMIT 1) as main_image
                FROM products p
                WHERE p.subcategory_id = ? AND p.is_published = 1
            `; // Мы явно указали "p.id"
        // --- КОНЕЦ ИСПРАВЛЕНИЯ ---

        database.all(productsQuery, [subcategory.id], (err, products) => {
          if (err) return reject(err);
          subcategory.products = products;
          resolve(subcategory);
        });
      });
    });
  }

  /**
   * Получает детальную информацию о товаре со всеми его изображениями.
   */
  function getProductDetails(productId, database = db) {
    return new Promise((resolve, reject) => {
      // --- НОВЫЙ, УЛУЧШЕННЫЙ ЗАПРОС ---
      const query = `
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
        `;
      database.get(query, [productId], (err, product) => {
        if (err) return reject(err);
        if (!product) return resolve(null);

        const imagesQuery = "SELECT filename FROM product_images WHERE product_id = ? ORDER BY sort_order ASC";
        database.all(imagesQuery, [productId], (err, images) => {
          if (err) return reject(err);
          product.images = images.map(img => img.filename);
          resolve(product);
        });
      });
    });
  }

  // --- 4. ФУНКЦИИ ДЛЯ АДМИН-ПАНЕЛИ (CRUD - Create, Read, Update, Delete) ---
  // (Пока что здесь будут заглушки, мы их реализуем, когда будем делать админку)

  // TODO: Реализовать CRUD для категорий
  // TODO: Реализовать CRUD для подкатегорий
  // TODO: Реализовать CRUD для товаров
  // TODO: Реализовать управление изображениями товаров

  return {
    db,
    // --- Экспорт публичных функций ---
    createTables,
    // Админы
    getAdmin,
    addAdmin,
    // Публичный каталог
    getCatalogStructure,
    getSubCategoryWithProducts,
    getProductDetails
  };
}

// Экспортируем единственный экземпляр (синглтон) для всего приложения
module.exports = createDatabase();
// Также экспортируем саму функцию для возможного использования в тестах
module.exports.createDatabase = createDatabase;