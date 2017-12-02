const Utils = require("../../utils/utils");

const handleMovieNotReturned = (database, id, res) =>
{
   /* 
    * Caso o usuário não tenha conseguido devolver o filme.
    * Procura o filme no banco de dados
    */
   database.queries.findMovie(id, res)
   .then(movie => 
   {
      /* Se o filme foi encontrado significa que ele não alugou ou já devolveu o filme */
      if(movie)
      {
         let errors = [];
         errors.push("you not rent or you already returned the movie with id " + id);

         res.status(404).json({errors});
      }
      else
      {
         /* 
         * Se o filme NÃO foi encontrado significa que foi enviado um id que não existe
         * no banco de dados 
         */
         let errors = [];
         errors.push("movie with id " + id + " not found");
         
         res.status(400).json({errors});
      }
   })
   .catch((error) =>
   {
      let errors = Utils.parseSequelizeErrors(error);
      res.status(500).json({errors});
   });
};

const updateLocatedCopies = (database, id, res) =>
{
   database.sequelize.query("UPDATE movie SET located_copies = located_copies - 1 " +
   "WHERE movie.id = :id",
   { 
      replacements: 
      { 
         id: id
      },
      
      type: database.sequelize.QueryTypes.UPDATE
   })
   .then((result) => 
   {
      database.queries.findMovie(id, res)
      .then(movie => 
      {
         res.status(200).json(
         {
            id: movie.id, 
            title: movie.title, 
            director: movie.director
         });
      });
   })
   .catch((error) =>
   {
      let errors = Utils.parseSequelizeErrors(error);
      res.status(500).json({errors});
   });
};

const handleDestroyResult = (result) =>
{
   return new Promise((resolve, reject) => 
   {
      /* 
       * Se result for igual a 1 significa que conseguiu deletar da tabela, portanto
       * deve-se diminuir o número de cópias locadas 
       */
      if(result)
      {
         resolve(true);
      }
      else
      {
         reject(false);
      }
   });
};

module.exports = (router, database) =>
{
   router.route("/movie_return")
   .post((req, res) =>
   {
      /* 
       * Tenta deletar na tabela "user_rented_movie" com o id do usuario
       * e id do filme que ele quer devolver 
       */
      database.models.UserRentedMovie.destroy(
      { 
         where: 
         {
            user_id: req.decodedToken.id,
            movie_id: req.body.id
         },

         limit: 1
      })
      .then(handleDestroyResult)
      .then((result) =>
      {
         updateLocatedCopies(database, req.body.id, res);
      },
      (error) =>
      {
         handleMovieNotReturned(database, req.body.id, res);
      })
      .catch((error) =>
      {
         let errors = Utils.parseSequelizeErrors(error);
         res.status(500).json({errors});
      });
   });
};