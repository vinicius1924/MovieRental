/* 
 * Ao executar esse arquivo no node: 
 * 
 * Primeiramente ele vai requerer o módulo "server"(que é onde está a configuração
 * e inicialização do meu servidor) e vai armazenar na constante "server"(definida aqui 
 * nesse arquivo) o que foi exportado dentro do arquivo "server.js"
 * 
 * Depois ele vai requerer o módulo "database"(que é onde está minha conexão com o mysql
 * e os modelos do banco de dados)
 * 
 * Depois ele vai requerer o módulo "api_routes"(que define que todas as rotas dentro do
 * caminho "/api" devem ser acessadas através de um token) e vai passar como parâmetro o que foi 
 * exportado dentro do arquivo "server.js"
 */
const server = require("./config/server");
const database = require("./config/database");

require("./api/routes/api_routes")(server.app, server.router, database);
require("./api/routes/unprotected/login")(server.app, database);
require("./api/routes/unprotected/new_user")(server.app, database);
require("./api/routes/protected/logout")(server.router, database);
require("./api/routes/protected/movie_rent")(server.router, database);
require("./api/routes/protected/movie_return")(server.router, database);
require("./api/routes/protected/movies")(server.router, database);
require("./api/routes/protected/search_movie")(server.router, database);