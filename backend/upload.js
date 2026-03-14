const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp"); 

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Допустимы только изображения!"), false);
    }
};

const upload = multer({ 
    storage, 
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } 
});

const optimizeImage = async (req, res, next) => {
    const files = req.files || (req.file ? [req.file] : []);
    
    if (files.length === 0) return next();

    req.optimizedFilenames = []; 

    try {
        for (const file of files) {
            const filename = `${uuidv4()}.webp`; 
            const outputPath = path.join(__dirname, "static", filename);

            await sharp(file.buffer)
                .resize({ width: 1200, withoutEnlargement: true }) 
                .webp({ quality: 80 }) 
                .toFile(outputPath);

            req.optimizedFilenames.push(filename);
        }

        if (req.file) {
            req.file.filename = req.optimizedFilenames[0];
        }

        next();
    } catch (error) {
        console.error("Ошибка при оптимизации изображения:", error);
        return res.status(500).json({ error: "Ошибка при обработке изображения" });
    }
};

module.exports = {
    uploadSingle: upload.single("image"),
    uploadMultiple: upload.array("images", 10), 
    optimizeImage
};