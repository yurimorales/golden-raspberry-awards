# Node.js Golden Raspberry Awards API

Projeto nodejs, utilizando sqlite, para listar os piores filmes da história

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd api
   ```

2. **Build and run the application:**
   ```
   docker-compose up --build ou docker-compose up -d (se o projeto já tiver sido executado antes)
   ```

3. **Access the API:**
   A API fica disponivel no endereço `http://localhost:3000`. Usar o postman ou o insomnia para testar os endpoints da api.

## Usage

- A aplicação, após inicializada, ira popular o arquivo `Movielist.csv` em um banco sqlite.
- A api apresenta os seguintes endpoints:
  - `GET /movies` - Busca todos os filmes
  - `POST /movies` - Adiciona um novo filme
  - `GET /movies/:id` - Obtem informações de um filme a partir de um ID
  - `PUT /movies/:id` - Atualiza informações de um filme pelo id ID
  - `DELETE /movies/:id` - Remove um filme pelo ID

## Dependencies

- Node.js
- Express
- SQLite

## License

This project is licensed under the MIT License.