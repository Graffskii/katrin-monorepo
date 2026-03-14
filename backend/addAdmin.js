const { addAdmin } = require("./admin");

(async () => {
    await addAdmin("katrin-admin", "0609password1977", "admin");
    console.log("Главный админ добавлен!");
})();
