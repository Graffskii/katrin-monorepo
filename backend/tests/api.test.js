const request = require("supertest");
const app = require("../app");  // Импортируем приложение Express
const path = require("path")

describe("API routes tests", () => {
  it("should login successfully", async () => {
    const response = await request(app)
      .post("/login")
      .send({ username: "admin", password: "password123" });

    expect(response.status).toBe(200); 
    //expect(response.header.location).toBe("/admin");
  });

  it("should return 401 for invalid login", async () => {
    const response = await request(app)
      .post("/login")
      .send({ username: "admin", password: "wrongpassword" });

    expect(response.status).toBe(401);
    expect(response.text).toBe("Неверный логин или пароль");
  });

  it("should upload image", async () => {
    const loginResponse = await request(app)
        .post("/login")
        .send({ username: "admin", password: "password123" })

    const token = loginResponse.header["set-cookie"].find(cookie =>
        cookie.startsWith("token=")
    ).split(";")[0].split("=")[1];

    const imagePath = path.join(__dirname, "static", "image.jpg");

    const response = await request(app)
        .post("/admin/upload")
        .set("Cookie", `token=${token}`)
        .attach("image", imagePath)
        .field("category", "Wedding Dresses")
        .field("caption", "Uploaded image");

    expect(response.status).toBe(200); 
    //expect(response.header.location).toBe("/admin");
  });

  it("should not upload non-image file", async () => {
      const loginResponse = await request(app)
          .post("/login")
          .send({ username: "admin", password: "password123" })

      const token = loginResponse.header["set-cookie"].find(cookie =>
          cookie.startsWith("token=")
      ).split(";")[0].split("=")[1];

      const nonImagePath = path.join(__dirname, "static", "non_image.txt");

    const response = await request(app)
        .post("/admin/upload")
        .set("Cookie", `token=${token}`)
        .attach("image", nonImagePath)
        .field("category", "landscape")
        .field("caption", "Invalid file");

    expect(response.status).toBe(500); // Ожидаем ошибку
  });
});
