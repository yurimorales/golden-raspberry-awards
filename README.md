# Node.js Golden Raspberry Awards API

Projeto Node.js utilizando SQLite para listar os piores filmes da história.

## Setup Instructions

1. **Clone o repositório:**

   ```sh
   git clone <repository-url>
   cd api
   ```

2. **Build e execução da aplicação via Docker:**

   ```sh
   docker-compose up --build
   ```

   Ou, se o projeto já tiver sido executado antes:

   ```sh
   docker-compose up -d

   ```

3. **Acessar a API:**
   A API ficará disponível em `http://localhost:3000/api/movies`.  
   Use Postman, Insomnia ou outro cliente HTTP para testar os endpoints.

## Como rodar os testes de integração

Os testes de integração garantem que os dados retornados pela API estão de acordo com o arquivo `Movielist.csv` utilizado para popular o banco SQLite.

### Passos para rodar os testes:

1. **Acesse o terminal do container Docker:**

   ```sh
   docker-compose exec api sh
   ```

2. **Execute os testes de integração:**

   ```sh
   npm test
   ```

   ou

   ```sh
   npx jest
   ```

   Os testes estão localizados em `src/tests/integration/movies.test.js` e verificam se os endpoints retornam os dados esperados conforme o CSV.

### Observações

- O banco de dados é criado em memória e populado automaticamente a partir do arquivo `Movielist.csv`, sempre que a aplicação é iniciada.
- Os testes de integração podem ser executados quantas vezes quiser, pois o banco é sempre recriado.

## Endpoints

- `GET /api/movies` - Busca todos os filmes (com filtros por query string)
- `GET /api/movies/:id` - Obtém informações de um filme pelo ID
- `POST /api/movies` - Adiciona um novo filme
- `PUT /api/movies/:id` - Atualiza informações de um filme pelo ID
- `DELETE /api/movies/:id` - Remove um filme pelo ID

### Filtros disponíveis em `GET /api/movies`

É possível utilizar filtros na busca por filmes usando parâmetros via query string:

- `year` — Busca por ano exato  
  Exemplo: `/api/movies?year=1980`
- `yearStart` e/ou `yearEnd` — Intervalo de anos  
  Exemplo: `/api/movies?yearStart=1980&yearEnd=1985`
- `title` — Busca por parte do título  
  Exemplo: `/api/movies?title=Rocky`
- `studios` — Busca por parte do nome do estúdio  
  Exemplo: `/api/movies?studios=Warner`
- `winner` — Filtra vencedores ou perdedores  
  Exemplo: `/api/movies?winner=yes` (apenas vencedores)  
  Exemplo: `/api/movies?winner=no` (apenas perdedores)

Pode ser combinados os filtros, por exemplo:  
`/api/movies?winner=yes&year=1980&studios=Universal`

### Busca de Intervalo de Prêmios entre Produtores

- `GET /api/movies/awards-intervals`

Retorna os produtores com os **menores** e **maiores** intervalos entre vitórias no prêmio, no seguinte formato:

```json
{
  "min": [
    {
      "producer": "Producer 1",
      "interval": 1,
      "previousWin": 2008,
      "followingWin": 2009
    },
    {
      "producer": "Producer 2",
      "interval": 1,
      "previousWin": 2018,
      "followingWin": 2019
    }
  ],
  "max": [
    {
      "producer": "Producer 1",
      "interval": 99,
      "previousWin": 1900,
      "followingWin": 1999
    },
    {
      "producer": "Producer 2",
      "interval": 99,
      "previousWin": 2000,
      "followingWin": 2099
    }
  ]
}
```

- **min**: Lista dos menores intervalos entre vitórias para cada produtor.
- **max**: Lista dos maiores intervalos entre vitórias para cada produtor.

**Exemplo de uso:**  
`GET /api/movies/awards-intervals`

## Dependencies

- Node.js
- Express
- SQLite
- Jest (para testes)
- Supertest (para testes)

## License

This project is licensed under the MIT License.
