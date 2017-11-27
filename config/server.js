/* Usado para criar a API REST */
const express = require("express");
/* Faz a interpretação do corpo da requisição vinda do browser */
const bodyParser = require("body-parser");
/* Utilizado para aceitar requisições de multiplas origens */
const cors = require("cors");
const http = require("http");

/* 
 * "express()" retorna uma função projetada para ser passada para o servidor HTTP
 * do node como um callback para lidar com as requisições 
 */
const app = express();

const router = express.Router();

const toExport = {};

toExport.app = app;
toExport.router = router;

/* Servidor vai executar na porta 3003 */
const port = 3003;

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
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

/* Retorna uma instância da classe "http.Server" do node */
const server = http.createServer(app);

/* Inicia um servidor http */
server.listen(port, () =>
{
   console.log(`BACKEND is running on port ${port}`);
});

// module.exports.server = server;
module.exports = toExport;
// module.exports.router = router;