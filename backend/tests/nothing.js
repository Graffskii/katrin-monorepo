const { getPublishedGallery, getAllGallery, addImage, updateImage, deleteImage, setDraft } = require("../admin");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(":memory:");  // Используем в памяти базу данных для тестов

// Перед каждым тестом создаем таблицы
beforeEach(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT,
      category TEXT,
      caption TEXT,
      draft BOOLEAN DEFAULT 0
    )
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'moderator'))
    )
  `);
});

afterEach(() => {
  db.run("DROP TABLE IF EXISTS gallery");
  db.run("DROP TABLE IF EXISTS admins");
});

describe("Admin database functions", () => {
  it("should add a new image", async () => {
    await addImage("/Users/user/projects/katrin-site/tests/static/test.jpg", "Wedding Dresses", "Test caption");
    const gallery = await getAllGallery();
    expect(gallery.length).toBe(1);
    expect(gallery[0].filename).toBe("test.jpg");

    await deleteImage(1)
  });

  it("should get published gallery", async () => {
    await addImage("/Users/user/projects/katrin-site/tests/static/published.jpg", "Wedding Dresses", "Published image");
    await addImage("/Users/user/projects/katrin-site/tests/static/draft.jpg", "Wedding Dresses", "Draft image");
    await setDraft(2);

    const publishedGallery = await getPublishedGallery();
    expect(publishedGallery.length).toBe(1);
    expect(publishedGallery[0].filename).toBe("published.jpg");

    await deleteImage(2)
    await deleteImage(1)
  });

  it("should delete an image", async () => {
    await addImage("/Users/user/projects/katrin-site/tests/static/delete.jpg", "Wedding Dresses", "Delete me");
    const galleryBefore = await getAllGallery();
    expect(galleryBefore.length).toBe(1);

    await deleteImage(1);
    const galleryAfter = await getAllGallery();
    expect(galleryAfter.length).toBe(0);
  });

  it("should update an image", async () => {
    await addImage("/Users/user/projects/katrin-site/tests/static/update.jpg", "Wedding Dresses", "Old caption");
    const galleryBefore = await getAllGallery();
    expect(galleryBefore[0].caption).toBe("Old caption");

    await updateImage(1, "Wedding Dresses", "New caption");
    const galleryAfter = await getAllGallery();
    expect(galleryAfter[0].caption).toBe("New caption");

    await deleteImage(1)
  });
});
