const sqlite3 = require('sqlite3').verbose();
const { dbFile } = require('./sqlite');

function getDb() {
  return new sqlite3.Database(dbFile);
}

module.exports = {
  getAllMovies() {
    return new Promise((resolve, reject) => {
      const db = getDb();
      db.all('SELECT * FROM movies', (err, rows) => {
        db.close();
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  getMovieById(id) {
    return new Promise((resolve, reject) => {
      const db = getDb();
      db.get('SELECT * FROM movies WHERE id = ?', [id], (err, row) => {
        db.close();
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
        'INSERT INTO movies (year, title, studios, producers, winner) VALUES (?, ?, ?, ?, ?)',
        [year, title, studios, producers, winner],
        function (err) {
          if (err) {
            db.close();
            reject(err);
          } else {
            db.get('SELECT * FROM movies WHERE id = ?', [this.lastID], (err, row) => {
              db.close();
              if (err) reject(err);
              else resolve(row);
            });
          }
        }
      );
    });
  },

  updateMovie(id, data) {
    return new Promise((resolve, reject) => {
      const db = getDb();
      const { year, title, studios, producers, winner } = data;
      db.run(
        'UPDATE movies SET year=?, title=?, studios=?, producers=?, winner=? WHERE id=?',
        [year, title, studios, producers, winner, id],
        function (err) {
          if (err) {
            db.close();
            reject(err);
          } else if (this.changes === 0) {
            db.close();
            resolve(null);
          } else {
            db.get('SELECT * FROM movies WHERE id = ?', [id], (err, row) => {
              db.close();
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
      db.run('DELETE FROM movies WHERE id=?', [id], function (err) {
        db.close();
        if (err) reject(err);
        else resolve(this.changes > 0);
      });
    });
  }
};