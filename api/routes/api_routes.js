const jwt = require("jsonwebtoken"); // usado para criar, assinar e verificar tokens
const env = require("../../config/.env");

let checkTokenData = (database, decodedToken, bearerToken, req, res, next) =>
{
   let errors = [];

   database.queries.findUserById(decodedToken.id, res)
   .then(user => 
   {
      if(user)
      {
         if(user.token == bearerToken)
         {
            req.decodedToken = decodedToken;
            next();
         }
         else
         {
            errors.push("Token not valid anymore. Please login");
            res.status(401).json({errors});
         }
      }
      else
      {
         let errors = [];
         errors.push("user not found");
         
         res.status(404).json({errors});
      }
   });
};

let handleTokenError = (error, res) =>
{
   let errors = [];

   if(error.name === "TokenExpiredError")
   {
     errors.push("Token expired. Please login");
     /* 
      * Manda um erro de não autorizado, ou seja, significa que o usuário não 
      * está com o token válido 
      */
     res.status(401).json({errors});
   }

   if(error.name === "JsonWebTokenError")
   {
     errors.push(error.message);
     res.status(500).json({errors});
   }
};

let verifyToken = (bearerToken, database, req, res, next) =>
{
   let errors = [];

   jwt.verify(bearerToken, env.jsonWebTokenSecret, (error, decoded) =>
   {
      /* Testa se contém algum erro com o token */
      if(error)
      {
         handleTokenError(error, res);
      } 
      else
      {
         checkTokenData(database, decoded, bearerToken, req, res, next);
      }
   });
};

let checkAuthorizationHeader = (auth) =>
{
   if(auth.startsWith("Bearer "))
   {
      var bearer = auth.split(" ");
      var bearerToken = bearer[1];
      let errors = [];
      
      if(auth === "Bearer " + bearerToken)
      {
         return bearerToken;
      }
      else
      {
         return false;
      }
   }
   else
   {
      return false;
   }
};

let authorizationHeaderNotSent = (res) =>
{
   let errors = [];
   errors.push("authorization required");
   /* 
    * Manda um erro de não autorizado, ou seja, significa que o usuário não 
    * mandou o cabeçalho Authorization
    */
   res.status(401).json({errors});
};

/* 
 * Router() é usado como um manipulador de rota, ou seja, definimos algumas rotas 
 * na instancia criada e depois usamos essas rotas dentro de uma outra rota. 
 */
module.exports = (app, router, database) =>
{
	/* 
    * O método use() abaixo faz com que QUALQUER requisição, tanto GET, PUT, POST, DELETE, 
    * que comece com "/api", use o que foi definido na instância do objeto "Router"
	 */
	app.use("/api", router);

   /* 
    * Se eu suprimir o primeiro parâmetro da função "use" da instância do objeto "Router", 
    * que é o path da requisição, então será usado o path default que é "/". 
    * Isso significa que toda a requisição que chegar para o path "/api", "/api/movie_rent" 
    * e assim por diante, vai primeiramente passar pelo middleware abaixo
    */
	router.use((req, res, next) =>
	{
		if(req.method === "OPTIONS")
		{
			next();
		}
		else
		{
         /* Retorna o campo "authorization" do cabeçalho da requisição */
			var auth = req.get("authorization");

			if(!auth)
			{
				authorizationHeaderNotSent(res);
			}
			else
			{
            let bearerToken = checkAuthorizationHeader(auth);
            
            if(bearerToken)
            {
               verifyToken(bearerToken, database, req, res, next);
            }
				else
				{
					let errors = [];
					errors.push("Authorization header must contain 'Bearer <token>'");
					/* 
					 * Manda um erro de não autorizado, ou seja, significa que o usuário mandou
					 * o cabeçalho Authorization mas no formato errado
					 */
					res.status(400).json({errors});
				}
			}
		}
	});
};