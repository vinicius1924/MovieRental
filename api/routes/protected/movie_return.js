const Utils = require("../../utils/utils");
const _ = require("lodash");

module.exports = (router, database) =>
{
   router.route("/movie_return")
   .post((req, res) =>
   {
      /* 
       * Tenta deletar na tabela "user_rented_movie" com o id do usuario
       * e id do filme que ele quer devolver 
       */
      database.UserRentedMovie.destroy(
      { 
         where: 
         {
            user_id: parseInt(req.decodedToken.id),
            movie_id: parseInt(req.body.id)
         },

         limit: 1
      })
      .then((result) => 
      {
         /* 
          * Se result for igual a 1 significa que conseguiu deletar da tabela, portanto
          * deve-se diminuir o número de cópias locadas 
          */
         if(result)
         {
            database.sequelize.query("UPDATE movie SET located_copies = located_copies - 1 " +
            "WHERE movie.id = :id",
            { 
               replacements: 
               { 
                  id: req.body.id
               },
               
               type: database.sequelize.QueryTypes.UPDATE
            })
            .then((result) => 
            {
               database.Movie.findOne(
               { 
                  where: 
                  {
                     id: req.body.id
                  } 
               })
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
         }
         else
         {
            database.Movie.findOne(
            { 
               where: 
               {
                  id: parseInt(req.body.id)
               } 
            })
            .then(movie => 
            {
               if(movie)
               {
                  let errors = [];
                  errors.push("you not rent or you already returned the movie with id " + req.body.id);
      
                  res.status(404).json({errors});
               }
               else
               {
                  /* 
                   * Se o filme NÃO foi encontrado significa que foi enviado um id que não existe
                   * no banco de dados 
                   */
                  let errors = [];
                  errors.push("movie with id " + req.body.id + " not found");
                  
                  res.status(400).json({errors});
               }
            })
            .catch((error) =>
            {
               let errors = Utils.parseSequelizeErrors(error);
               res.status(500).json({errors});
            });
         }
      })
      .catch((error) =>
      {
         let errors = Utils.parseSequelizeErrors(error);
         res.status(500).json({errors});
      });
   });
};