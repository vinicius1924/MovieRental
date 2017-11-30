/* Usado para criar a API REST */
const express = require("express");
/* Faz a interpretação do corpo da requisição vinda do browser */
const bodyParser = require("body-parser");
/* Utilizado para aceitar requisições de multiplas origens */
const cors = require("cors");
/* 
 * "express()" retorna uma função projetada para ser passada para o servidor HTTP
 * do node como um callback para lidar com as requisições 
 */
const app = express();
const router = express.Router();

/* 
 * urlencoded é o formato dos dados quando se faz a submissão de um formulário na aplicação frontend.
 * 
 * Quando se põe "extended: true" o body-parser vai ser capaz de interpretar mais tipos de informações
 * do que diz a especificação do urlencoded
 *
 * TODA a requisição que chegar no servidor vai passar primeiro pelo middleware 
 * "bodyParser.urlencoded" definido abaixo. Caso os dados que vierem na requisição NÃO sejam 
 * dados submetidos de um formulário, urlencoded vai passar para o próximo middleware, que nesse 
 * caso é "bodyParser.json". Se o conteúdo vindo no corpo da requisição for um json então será 
 * feita uma interpretação e o conteúdo será transformado em um objeto para ser usado dentro 
 * do backend
 */
app.use(bodyParser.urlencoded({extended: true})); // para analisar application/x-www-form-urlencoded
app.use(bodyParser.json()); // para analisar application/json
app.use(cors());

const database = require("./config/database");
require("./api/routes/api_routes")(app, router, database);
require("./api/routes/unprotected/login")(app, database);
require("./api/routes/unprotected/new_user")(app, database);
require("./api/routes/protected/logout")(router, database);
require("./api/routes/protected/movie_rent")(router, database);
require("./api/routes/protected/movie_return")(router, database);
require("./api/routes/protected/movies")(router, database);
require("./api/routes/protected/search_movie")(router, database);
require("./config/server")(app);