require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcrypt");

// --- ИМПОРТЫ ДЛЯ БЕЗОПАСНОСТИ ---
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const sanitizeHtml = require('sanitize-html'); // Понадобится позже для SEO-текстов

// Импорты ваших модулей
const { getAdmin } = require("./admin"); 
const { generateToken } = require("./generateToken");
const catalogRoutes = require("./catalogRoutes");
const adminRoutes = require("./routes");

const authMiddleware = require("./middleware/authMiddleware"); 

const app = express();

// --- 1. БАЗОВАЯ БЕЗОПАСНОСТЬ (HELMET) ---
// Helmet устанавливает секьюрные HTTP-заголовки
app.use(helmet({
    crossOriginResourcePolicy: false, // Нужно для загрузки картинок с других доменов, если будут
}));

// CORS
app.use(cors({
    origin: "http://82.202.137.80", // Ваш домен
    credentials: true 
}));

app.use(express.static("public"));
app.use("/static", express.static("static"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    session({
        secret: process.env.SESSION_SECRET || "supersecretkey", // Лучше брать из .env
        resave: false,
        saveUninitialized: true,
    })
);


// --- 2. ЗАЩИТА ОТ СПАМА ДЛЯ API (Rate Limiting) ---

// Общий лимит для всех API запросов (чтобы не парсили каталог каждую секунду)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 500, // Максимум 500 запросов с одного IP
    message: "Слишком много запросов с вашего IP, пожалуйста, попробуйте позже."
});
app.use("/api/", apiLimiter);

// ЖЕСТКИЙ лимит специально для формы записи (чтобы не спамили в Telegram)
const contactFormLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 час
    max: 3, // Максимум 3 заявки в час с одного IP!
    message: "Вы уже отправили заявку. Мы свяжемся с вами в ближайшее время."
});


// --- РОУТЫ АВТОРИЗАЦИИ ---
// (Оставляем как есть, только убираем неиспользуемую функцию проверки пароля)
app.post("/api/login", async (req, res) => { // Добавил префикс /api/
    const { username, password } = req.body;
    const admin = await getAdmin(username);
    
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
        return res.status(401).json({ error: "Неверный логин или пароль" });
    }
    
    const token = generateToken(admin);
    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.json({ username: admin.username, role: admin.role });
});

app.get("/api/logout", (req, res) => { // Добавил префикс /api/
    res.clearCookie("token");
    res.json({ message: "Выход выполнен" });
});

app.get("/api/check-auth", authMiddleware, (req, res) => {
    // Если authMiddleware пропустил запрос сюда, значит токен жив и валиден
    res.json({ success: true, user: req.admin });
});

// --- 3. ОБРАБОТКА ФОРМЫ (С ЗАЩИТОЙ И ПРОВЕРКАМИ) ---
// Применяем жесткий лимит контактной формы
app.post("/api/contact", contactFormLimiter, (req, res) => {
    const { name, number, message, date } = req.body; // Добавили date, если оно есть в форме
    
    // 1. Базовая валидация
    if (!name || !number) {
        return res.status(400).json({ error: "Имя и номер телефона обязательны" });
    }

    // 2. Очистка от HTML-тегов (защита от XSS, если кто-то вставит скрипт в поле "message")
    const cleanMessage = sanitizeHtml(message || "Без комментариев", {
        allowedTags: [], // Запрещаем ВСЕ теги
        allowedAttributes: {}
    });

    // Формируем красивое сообщение для Telegram
    let msg = `<b>Новая заявка на примерку!</b>\n\n` +
              `👤 <b>Имя:</b> ${sanitizeHtml(name, {allowedTags:[]})}\n` +
              `📞 <b>Телефон:</b> ${sanitizeHtml(number, {allowedTags:[]})}\n`;
    
    if (date) msg += `📅 <b>Желаемая дата:</b> ${sanitizeHtml(date, {allowedTags:[]})}\n`;
    msg += `💬 <b>Комментарий:</b>\n${cleanMessage}`;

    const encodedMsg = encodeURI(msg);

    // Используем современный fetch вместо устаревшего request
    fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage?chat_id=${process.env.TELEGRAM_CHATID}&parse_mode=html&text=${encodedMsg}`, {
        method: 'POST'
    })
    .then(response => {
        if (response.ok) {
            res.json({ success: true, message: "Заявка успешно отправлена!" });
        } else {
            throw new Error(`Telegram API Error: ${response.status}`);
        }
    })
    .catch(error => {
        console.error('Ошибка отправки в Telegram:', error);
        // Важно: мы не говорим клиенту, что Telegram отвалился, для него это просто "ошибка"
        res.status(500).json({ error: "Произошла ошибка при отправке. Пожалуйста, позвоните нам." });
    });
});


// --- ПОДКЛЮЧЕНИЕ РОУТОВ ---
app.use("/api/catalog", catalogRoutes);
app.use("/api/admin", adminRoutes); // Обратите внимание на префикс /api/


if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;