const request = require("supertest");
const fs = require("fs");
const path = require("path");
const { initDb } = require("../../db/sqlite");
const app = require("../../app");

describe("Movies API Integration", () => {
  let csvMovies = [];

  beforeAll(async () => {
    // Aguarda o sqlite em memoria estar pronto
    await initDb();

    // Lê os dados do CSV fornecidos na proposta
    const csvFile = path.join(__dirname, "../../../Movielist.csv");
    const csvData = fs.readFileSync(csvFile, "utf8");
    csvMovies = csvData
      .split("\n")
      .slice(1)
      .filter((line) => line.trim())
      .map((line) => {
        const [year, title, studios, producers, winner] = line.split(";");
        return {
          year: parseInt(year, 10),
          title,
          studios,
          producers,
          winner: winner ? winner.trim() : null,
        };
      });
  });

  it("GET /api/movies deve retornar todos os filmes do CSV", async () => {
    const res = await request(app).get("/api/movies");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(csvMovies.length);

    // Verifica se os filmes do CSV estão presentes na resposta
    for (let i = 0; i < csvMovies.length; i++) {
      expect(res.body[i].title).toBe(csvMovies[i].title);
      expect(res.body[i].year).toBe(csvMovies[i].year);
      expect(res.body[i].studios).toBe(csvMovies[i].studios);
      expect(res.body[i].producers).toBe(csvMovies[i].producers);
      // winner pode ter os seguintes valores: null, '', ou 'yes'
      expect(
        res.body[i].winner === csvMovies[i].winner ||
          (res.body[i].winner === "" && csvMovies[i].winner === null)
      ).toBe(true);
    }
  });

  it("GET /api/movies/:id deve retornar o filme correto", async () => {
    // Testando somente 3 primeiros filmes obtidos do CSV
    for (let i = 0; i < 3; i++) {
      const res = await request(app).get(`/api/movies/${i + 1}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe(csvMovies[i].title);
      expect(res.body.year).toBe(csvMovies[i].year);
      expect(res.body.studios).toBe(csvMovies[i].studios);
      expect(res.body.producers).toBe(csvMovies[i].producers);
    }
  });

  it("GET /api/movies?year=1980 deve filtrar por ano", async () => {
    const res = await request(app).get("/api/movies?year=1980");
    expect(res.statusCode).toBe(200);
    const expected = csvMovies.filter((m) => m.year === 1980);
    expect(res.body.length).toBe(expected.length);
    res.body.forEach((movie) => {
      expect(movie.year).toBe(1980);
    });
  });

  it("GET /api/movies?winner=yes deve filtrar apenas vencedores", async () => {
    const res = await request(app).get("/api/movies?winner=yes");
    expect(res.statusCode).toBe(200);
    const expected = csvMovies.filter((m) => m.winner === "yes");
    expect(res.body.length).toBe(expected.length);
    res.body.forEach((movie) => {
      expect(movie.winner).toBe("yes");
    });
  });

  it("GET /api/movies?title=Rocky deve filtrar por título", async () => {
    const res = await request(app).get("/api/movies?title=Rocky");
    expect(res.statusCode).toBe(200);
    res.body.forEach((movie) => {
      expect(movie.title).toEqual(expect.stringContaining("Rocky"));
    });
  });

  it("GET /api/movies/awards-intervals deve retornar formato correto", async () => {
    const res = await request(app).get("/api/movies/awards-intervals");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("min");
    expect(res.body).toHaveProperty("max");
    expect(Array.isArray(res.body.min)).toBe(true);
    expect(Array.isArray(res.body.max)).toBe(true);
    if (res.body.min.length > 0) {
      expect(res.body.min[0]).toHaveProperty("producer");
      expect(res.body.min[0]).toHaveProperty("interval");
      expect(res.body.min[0]).toHaveProperty("previousWin");
      expect(res.body.min[0]).toHaveProperty("followingWin");
    }
  });
});

describe("Movies API Integration - Testes Negativos", () => {
  let csvMovies = [];

  beforeAll(async () => {
    // Aguarda o sqlite em memoria estar inicializado
    await initDb();

    // Usando o CSV com dados inválidos
    const csvFile = path.join(__dirname, "../../../Movielist_incorreto.csv");
    const csvData = fs.readFileSync(csvFile, "utf8");
    csvMovies = csvData
      .split("\n")
      .slice(1)
      .filter((line) => line.trim())
      .map((line) => {
        const [year, title, studios, producers, winner] = line.split(";");
        return {
          year: parseInt(year, 10),
          title,
          studios,
          producers,
          winner: winner ? winner.trim() : null,
        };
      });
  });

  it("NÃO deve retornar um filme inexistente", async () => {
    const res = await request(app).get("/api/movies/1234567890");
    expect(res.statusCode).toBe(404);
  });

  it("NÃO deve retornar filmes com ano inexistente", async () => {
    const res = await request(app).get("/api/movies?year=1050");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(0);
  });

  it("NÃO deve retornar filmes com título inexistente", async () => {
    const res = await request(app).get(
      "/api/movies?title=FilmeQueNaoExiste123451000"
    );
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(0);
  });

  // CSV incorreto, estes testes DEVEM FALHAR!
  it("Deve falhar se um campo obrigatório estiver faltando no CSV", async () => {
    const linhaInvalida = csvMovies.find(
      (m) => !m.year || !m.title || !m.studios || !m.producers
    );
    expect(linhaInvalida).toBeUndefined();
  });

  // Deve FALHAR, pois há winner inválido
  it("Deve falhar se houver um valor inesperado em 'winner'", async () => {
    const winnerInvalido = csvMovies.find(
      (m) => m.winner && m.winner !== "yes"
    );
    expect(winnerInvalido).toBeUndefined();
  });
});
