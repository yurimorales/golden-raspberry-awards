const request = require('supertest');
const fs = require('fs');
const path = require('path');
const { initDb } = require('../../db/sqlite'); // Importa o initDb
const app = require('../../app');

describe('Movies API Integration', () => {
  let csvMovies = [];

  beforeAll(async () => {
    // Aguarda o sqlite em memoria estar pronto
    await initDb();

    // Lê os dados do CSV
    const csvFile = path.join(__dirname, '../../../Movielist.csv');
    const csvData = fs.readFileSync(csvFile, 'utf8');
    csvMovies = csvData
      .split('\n')
      .slice(1)
      .filter(line => line.trim())
      .map(line => {
        const [year, title, studios, producers, winner] = line.split(';');
        return {
          year: parseInt(year, 10),
          title,
          studios,
          producers,
          winner: winner ? winner.trim() : null,
        };
      });
  });

  it('GET /api/movies deve retornar todos os filmes do CSV', async () => {
    const res = await request(app).get('/api/movies');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(csvMovies.length);

    // Verifica se o primeiro filme bate com o CSV
    expect(res.body[0].title).toBe(csvMovies[0].title);
    expect(res.body[0].year).toBe(csvMovies[0].year);
  });

  it('GET /api/movies/:id deve retornar o filme correto', async () => {
    const res = await request(app).get('/api/movies/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(csvMovies[0].title);
    expect(res.body.year).toBe(csvMovies[0].year);
  });
});