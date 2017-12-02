const jwt = require("jsonwebtoken"); // usado para criar, assinar e verificar tokens
const env = require("../../config/.env");

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
			var auth = req.get("authorization");

			if(!auth)
			{
				let errors = [];
				errors.push("authorization required");
				/* 
				 * Manda um erro de não autorizado, ou seja, significa que o usuário não 
				 * mandou o cabeçalho Authorization
				 */
				res.status(401).json({errors});
			}
			else
			{
				if(auth.startsWith("Bearer "))
				{
					var bearer = auth.split(" ");
					var bearerToken = bearer[1];
					let errors = [];
					
					if(auth === "Bearer " + bearerToken)
					{
						jwt.verify(bearerToken, env.jsonWebTokenSecret, (error, decoded) =>
						{
							/* Testa se contém algum erro com o token */
				    		if(error)
					    	{
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
					      } 
					      else
					      {
                        database.models.User.findOne(
                        {
                           attributes: ["token"],

                           where:
                           {
                              id: decoded.id
                           }
                        })
                        .then(user => 
                        {
                           if(user)
                           {
                              if(user.token == bearerToken)
                              {
                                 req.decodedToken = decoded;
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
                              
                              res.status(412).json({errors});
                           }
                        });
					      }
						});
					}
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