const jwt = require("jsonwebtoken"); // usado para criar, assinar e verificar tokens
const env = require("../../config/.env");

/* 
 * Router() é usado como um manipulador de rota, ou seja, definimos algumas rotas 
 * na instancia criada e depois usamos essas rotas dentro de uma outra rota. 
 */
//const router = require("../../config/server").router;

module.exports = (app, router) =>
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
		//console.log("chamei /api/");

		if(req.method === "OPTIONS")
		{
			console.log("method === OPTIONS");
			next();
		}
		else
		{
			var auth = req.get("authorization");

			if(!auth)
			{
				let errors = [];
				errors.push("Autorização requerida");
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
									errors.push("Token expirado. Por favor faça login");
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
					      	if(req.originalUrl === "/api" || req.originalUrl === "/api/")
					      	{
					      		res.status(200).json({message: "Bem vindo a minha api"});
					      	}
					      	else
					      	{
                           req.decodedToken = decoded;
                           //console.log("id de quem está fazendo a chamada = " + decoded.id);
					      		//console.log("chamei next()");
					      		next();
					      	}
					      }
						});
					}
				}
				else
				{
					let errors = [];
					errors.push("Cabeçalho de autorização deve conter 'Bearer <token>' ");
					/* 
					 * Manda um erro de não autorizado, ou seja, significa que o usuário mandou
					 * o cabeçalho Authorization mas no formato errado
					 */
					res.status(401).json({errors});
				}
			}
		}
	});
};