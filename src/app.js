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
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database initialization failed:", err);
  });
