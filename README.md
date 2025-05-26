# Node.js Golden Raspberry Awards API

Projeto Node.js utilizando SQLite para listar os piores filmes da história.

## Intruções de configuração

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

Os testes de integração garantem que os dados retornados pela API estão de acordo com o arquivo CSV utilizado para popular o banco SQLite.

### Estruturas de dados de entrada

- **Movielist.csv**: Arquivo com dados válidos. Os testes devem PASSAR.
- **Movielist_incorreto.csv**: Arquivo com dados inválidos (campos obrigatórios faltando, valores inesperados, etc). Os testes negativos devem FALHAR, garantindo a precisão e integridade dos dados.

### Passo a passo para rodar os testes de integração

1. **Acesse o terminal do container Docker:**

```sh
docker-compose exec api sh
```

2. **Execute todos os testes de integração (válidos e negativos):**

```sh
npm test
```

ou

```sh
npx jest
```

  Isso executa todos os testes do arquivo `src/tests/integration/movies.test.js`, validando tanto o cenário de dados corretos quanto o de dados incorretos.

---

### Como rodar apenas os testes de integração com dados válidos (devem PASSAR)

Os testes de integração padrão usam o arquivo `Movielist.csv` (válido).  
Para rodar apenas esses testes, remova ou comente o `.only` do bloco `describe` dos testes negativos no arquivo `movies.test.js`:

```javascript
// Altere de:
describe.only("Movies API Integration - Testes Negativos", () => { ... });

// Para:
describe("Movies API Integration - Testes Negativos", () => { ... });
```

Depois, executar o comando:

```sh
npm test
```
---

### Como rodar apenas os testes negativos (com dados inválidos, devem FALHAR)

Para rodar apenas os testes negativos (que usam `Movielist_incorreto.csv`):

1. Certifique-se de que o bloco dos testes negativos está com `.only`:

```javascript
describe.only("Movies API Integration - Testes Negativos", () => { ... });
```

2. Execute:

```sh
npm test
```

  Os testes devem FALHAR, pois o arquivo `Movielist_incorreto.csv` contém linhas inválidas.

---

### Como rodar um teste específico

Você pode rodar apenas um teste específico adicionando `.only` ao `it` desejado:

```javascript
it.only("Deve falhar se um campo obrigatório estiver faltando no CSV", async () => { ... });
```
---

### Observações

- O banco de dados é criado em memória e populado automaticamente a partir do arquivo CSV sempre que a aplicação é iniciada.
- Os testes de integração podem ser executados quantas vezes quiser, pois o banco é sempre recriado.
- Os testes negativos são requeridos para garantir que a API rejeita ou identifica dados inconsistentes.

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

Podem ser combinados alguns filtros, por exemplo:  
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
    }
  ],
  "max": [
    {
      "producer": "Producer 2",
      "interval": 99,
      "previousWin": 1900,
      "followingWin": 1999
    }
  ]
}
```
---

## Dependências

- Node.js
- Express
- SQLite
- Jest (para testes)
- Supertest (para testes)

## License

This project is licensed under the MIT License.
