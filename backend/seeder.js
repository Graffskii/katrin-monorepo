// backend/seeder.js
const { createDatabase } = require('./admin');
const path = require('path');

// Указываем путь к нашей БД
const dbMethods = createDatabase(path.join(__dirname, 'db.sqlite'));
const db = dbMethods.db;

// --- ТЕСТОВЫЕ ДАННЫЕ ---

const categories = [
    { id: 1, name: 'Свадебные платья', slug: 'wedding-dresses', cover_image: 'category-wedding.jpg', description: 'Откройте для себя нашу эксклюзивную коллекцию свадебных платьев.', seo_text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.' },
    { id: 2, name: 'Вечерние платья', slug: 'evening-dresses', cover_image: 'category-evening.jpg', description: 'Идеальные наряды для любого торжественного случая.', seo_text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.' },
    { id: 3, name: 'Аксессуары', slug: 'accessories', cover_image: 'category-accessories.jpg', description: 'Завершите свой образ нашими изысканными аксессуарами.', seo_text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.' },
];

const subcategories = [
    // Для Свадебных платьев
    { id: 1, category_id: 1, name: 'Пышные', slug: 'puffy', cover_image: 'subcategory-puffy.jpg', seo_text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.' },
    { id: 2, category_id: 1, name: 'Силуэтные', slug: 'silhouette', cover_image: 'subcategory-silhouette.jpg', seo_text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.' },
    { id: 3, category_id: 1, name: 'А-силуэт', slug: 'a-silhouette', cover_image: 'subcategory-a-silhouette.jpg', seo_text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.' },
    // Для Вечерних платьев
    { id: 4, category_id: 2, name: 'Коктейльные', slug: 'cocktail', cover_image: 'subcategory-cocktail.jpg', seo_text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.' },
    { id: 5, category_id: 2, name: 'В пол', slug: 'maxi', cover_image: 'subcategory-maxi.jpg', seo_text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.' },
];

const products = [
    // Пышные
    { id: 1, subcategory_id: 1, name: 'Монро', sku: 'SV001', price: 65000, old_price: 72000, description: 'Классическое пышное платье принцессы с корсетом, расшитым кристаллами.' },
    { id: 2, subcategory_id: 1, name: 'Аврора', sku: 'SV002', price: 89000, old_price: null, description: 'Роскошное платье с многослойной юбкой из тюля и длинным шлейфом.' },
    // Силуэтные
    { id: 3, subcategory_id: 2, name: 'Венера', sku: 'SV003', price: 58000, old_price: null, description: 'Элегантное силуэтное платье "рыбка" из атласа.' },
    // Коктейльные
    { id: 4, subcategory_id: 4, name: 'Грейс', sku: 'EV001', price: 35000, old_price: 40000, description: 'Игривое коктейльное платье-бюстье небесного цвета.' },
];

const productImages = [
    // Монро
    { product_id: 1, filename: 'monroe_1.jpg', sort_order: 0 },
    { product_id: 1, filename: 'monroe_2.jpg', sort_order: 1 },
    // Аврора
    { product_id: 2, filename: 'aurora_1.jpg', sort_order: 0 },
    // Венера
    { product_id: 3, filename: 'venus_1.jpg', sort_order: 0 },
    { product_id: 3, filename: 'venus_2.jpg', sort_order: 1 },
    // Грейс
    { product_id: 4, filename: 'grace_1.jpg', sort_order: 0 },
];

function seed() {
    console.log('Начинаю заполнение базы данных (better-sqlite3)...');

    // Оборачиваем все операции в одну транзакцию. 
    // Это невероятно быстро и гарантирует, что если будет ошибка, база не сломается наполовину.
    const insertData = db.transaction(() => {
        console.log('Очистка старых данных...');
        db.prepare('DELETE FROM product_images').run();
        db.prepare('DELETE FROM products').run();
        db.prepare('DELETE FROM subcategories').run();
        db.prepare('DELETE FROM categories').run();
        
        console.log('Добавление категорий...');
        const insertCategory = db.prepare('INSERT INTO categories (id, name, slug, cover_image, description) VALUES (?, ?, ?, ?, ?)');
        for (const c of categories) {
            insertCategory.run(c.id, c.name, c.slug, c.cover_image, c.description);
        }

        console.log('Добавление подкатегорий...');
        const insertSubcat = db.prepare('INSERT INTO subcategories (id, category_id, name, slug, cover_image) VALUES (?, ?, ?, ?, ?)');
        for (const s of subcategories) {
            insertSubcat.run(s.id, s.category_id, s.name, s.slug, s.cover_image);
        }

        console.log('Добавление товаров...');
        const insertProduct = db.prepare('INSERT INTO products (id, subcategory_id, name, sku, price, old_price, description) VALUES (?, ?, ?, ?, ?, ?, ?)');
        for (const p of products) {
            insertProduct.run(p.id, p.subcategory_id, p.name, p.sku, p.price, p.old_price, p.description);
        }

        console.log('Добавление изображений товаров...');
        const insertImage = db.prepare('INSERT INTO product_images (product_id, filename, sort_order) VALUES (?, ?, ?)');
        for (const img of productImages) {
            insertImage.run(img.product_id, img.filename, img.sort_order);
        }
    });

    try {
        // Выполняем транзакцию синхронно
        insertData();
        console.log('✅ База данных успешно заполнена!');
    } catch (error) {
        console.error('❌ Ошибка при заполнении базы данных:', error);
    } finally {
        db.close();
    }
}

seed();