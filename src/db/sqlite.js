const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const dbFile = ":memory:";
const csvFile = path.join(__dirname, "../../Movielist.csv");

let db; // Instância global

function getDb() {
  return db;
}

function initDb() {
  return new Promise((resolve, reject) => {
      db = new sqlite3.Database(dbFile, (err) => {
      if (err) return reject(err);

      db.serialize(() => {
        db.run(
          `CREATE TABLE IF NOT EXISTS movies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            year INTEGER,
            title TEXT,
            studios TEXT,
            producers TEXT,
            winner TEXT
          )`,
          (err) => {
            if (err) return reject(err);

            // Popula o banco se estiver vazio
            db.get("SELECT COUNT(*) AS count FROM movies", (err, row) => {
              if (err) return reject(err);
              if (row.count === 0) {
                // Lê e insere do CSV
                const csvData = fs.readFileSync(csvFile, "utf8");
                const rows = csvData.split("\n").slice(1);
                const stmt = db.prepare(
                  "INSERT INTO movies (year, title, studios, producers, winner) VALUES (?, ?, ?, ?, ?)"
                );
                for (const row of rows) {
                  if (row.trim()) {
                    const [year, title, studios, producers, winner] =
                      row.split(";");
                    stmt.run(year, title, studios, producers, winner || null);
                  }
                }
                stmt.finalize(resolve);
              } else {
                resolve();
              }
            });
          }
        );
      });
    });
  });
}

module.exports = { initDb, getDb };
