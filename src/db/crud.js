const { getDb } = require("./sqlite");

module.exports = {
  getAllMovies() {
    return new Promise((resolve, reject) => {
      const db = getDb();
      db.all("SELECT * FROM movies", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  async getAwardsIntervals() {
    const db = getDb();
    // Busca todos os vencedores e seus anos
    const winners = await new Promise((resolve, reject) => {
      db.all(
        "SELECT producers, year FROM movies WHERE winner = 'yes'",
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    // Mapeia produtores e seus anos de vitória
    const producerWins = {};
    winners.forEach(({ producers, year }) => {
      // Divide múltiplos produtores (separados por ' and ', ', ', ' e ')
      producers.split(/, | and | e /).forEach((producer) => {
        const name = producer.trim();
        if (!name) return;
        if (!producerWins[name]) producerWins[name] = [];
        producerWins[name].push(year);
      });
    });

    // Calcula intervalos
    const intervals = [];
    Object.entries(producerWins).forEach(([producer, years]) => {
      if (years.length < 2) return;
      const sorted = years.sort((a, b) => a - b);
      for (let i = 1; i < sorted.length; i++) {
        intervals.push({
          producer,
          interval: sorted[i] - sorted[i - 1],
          previousWin: sorted[i - 1],
          followingWin: sorted[i],
        });
      }
    });

    if (intervals.length === 0) {
      return { min: [], max: [] };
    }

    // Encontra os menores e maiores intervalos
    const minInterval = Math.min(...intervals.map((i) => i.interval));
    const maxInterval = Math.max(...intervals.map((i) => i.interval));

    return {
      min: intervals.filter((i) => i.interval === minInterval),
      max: intervals.filter((i) => i.interval === maxInterval),
    };
  },

  getMoviesByFilter(filters) {
    return new Promise((resolve, reject) => {
      const db = getDb();
      let query = "SELECT * FROM movies WHERE 1=1";
      const params = [];

      if (filters.year) {
        query += " AND year = ?";
        params.push(Number(filters.year));
      }
      if (filters.yearStart) {
        query += " AND year >= ?";
        params.push(Number(filters.yearStart));
      }
      if (filters.yearEnd) {
        query += " AND year <= ?";
        params.push(Number(filters.yearEnd));
      }
      if (filters.title) {
        query += " AND title LIKE ?";
        params.push(`%${filters.title}%`);
      }
      if (filters.studios) {
        query += " AND studios LIKE ?";
        params.push(`%${filters.studios}%`);
      }
      if (filters.winner === "yes") {
        query += " AND winner = 'yes'";
      }
      if (filters.winner === "no") {
        query += " AND (winner IS NULL OR winner = '')";
      }

      db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  getMovieById(id) {
    return new Promise((resolve, reject) => {
      const db = getDb();
      db.get("SELECT * FROM movies WHERE id = ?", [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  createMovie(data) {
    return new Promise((resolve, reject) => {
      const db = getDb();
      const { year, title, studios, producers, winner } = data;
      db.run(
        "INSERT INTO movies (year, title, studios, producers, winner) VALUES (?, ?, ?, ?, ?)",
        [year, title, studios, producers, winner],
        function (err) {
          if (err) {
            reject(err);
          } else {
            db.get(
              "SELECT * FROM movies WHERE id = ?",
              [this.lastID],
              (err, row) => {
                if (err) reject(err);
                else resolve(row);
              }
            );
          }
        }
      );
    });
  },

  async updateMovie(id, data) {
    const db = getDb();
    // Busca o registro atual
    const current = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM movies WHERE id = ?", [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    if (!current) return null;

    // Mesclando os dados, se não vieram no body, mantém o valor atual
    const updated = {
      year: data.year !== undefined ? data.year : current.year,
      title: data.title !== undefined ? data.title : current.title,
      studios: data.studios !== undefined ? data.studios : current.studios,
      producers:
        data.producers !== undefined ? data.producers : current.producers,
      winner: data.winner !== undefined ? data.winner : current.winner,
    };

    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE movies SET year=?, title=?, studios=?, producers=?, winner=? WHERE id=?",
        [
          updated.year,
          updated.title,
          updated.studios,
          updated.producers,
          updated.winner,
          id,
        ],
        function (err) {
          if (err) {
            reject(err);
          } else if (this.changes === 0) {
            resolve(null);
          } else {
            db.get("SELECT * FROM movies WHERE id = ?", [id], (err, row) => {
              if (err) reject(err);
              else resolve(row);
            });
          }
        }
      );
    });
  },

  deleteMovie(id) {
    return new Promise((resolve, reject) => {
      const db = getDb();
      db.run("DELETE FROM movies WHERE id=?", [id], function (err) {
        if (err) reject(err);
        else resolve(this.changes > 0);
      });
    });
  },
};
