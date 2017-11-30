const http = require("http");

/* Servidor vai executar na porta 3003 */
const port = 3003;

module.exports = (app) =>
{
   /* Retorna uma instância da classe "http.Server" do node */
   const server = http.createServer(app);

   /* Inicia um servidor http */
   server.listen(port, () =>
   {
      console.log(`BACKEND is running on port ${port}`);
   });
};