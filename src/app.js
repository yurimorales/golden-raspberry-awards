const express = require("express");
const { initDb } = require("./db/sqlite");
const bodyParser = require("body-parser");
const movieRoutes = require("./routes/movies");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use("/api/movies", movieRoutes);

initDb()
  .then(() => {
    // Só inicia o servidor se o arquivo for executado diretamente (não durante testes)
    if (require.main === module) {
      app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error("Database initialization failed:", err);
  });

module.exports = app;
