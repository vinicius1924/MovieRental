const Utils = require("../../utils/utils");
const _ = require("lodash");

module.exports = (router, database) =>
{
   router.route("/movie_return")
   .post((req, res) =>
   {
      /* 
       * Atualiza o campo located_copies da tabela movie, somando 1, caso o numero de 
       * copias existentes, menos o numero de copias alugadas, seja maior que zero 
       */
      database.sequelize.query("UPDATE movie SET movie.located_copies = movie.located_copies - 1 " +
      "WHERE EXISTS (SELECT user_id, movie_id FROM user_rented_movie " + 
      "WHERE user_id = :userId AND movie_id = :movieId) " +
      "AND movie.id = :movieId",
      { 
         replacements: 
         { 
            movieId: parseInt(req.body.id),
            userId: parseInt(req.decodedToken.id)
         },
         
         type: database.sequelize.QueryTypes.UPDATE
      })
      .then((result) => 
      {
         /* 
          * Testa se alguma linha foi afetada pelo update. Se foi alterada significa
          * que o filme foi realmente alugado por esse usuário
          */
         if(result[1] == 1)
         {  
            /* 
             * Procura uma entrada na tabela "user_rented_movie" com o id do usuario
             * e id do filme que ele quer devolver 
             */
            database.UserRentedMovie.findOne(
            { 
               where: 
               {
                  movie_id: req.body.id
               } 
            })
            .then(userRentedMovie => 
            {
               /* Remove a entrada encontrada */
               userRentedMovie.destroy()
               .then(() =>
               {
                  /* Procura os dados do filme que foi devolvido e retorna como resposta */
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
                  })
                  .catch((error) =>
                  {
                     let errors = Utils.parseSequelizeErrors(error);
                     res.status(500).json({errors});
                  });                  
               })
               .catch((error) =>
               {
                  let errors = Utils.parseSequelizeErrors(error);
                  res.status(500).json({errors});
               });
            });
         }
         else
         {
            /* 
             * Caso o usuário não tenha conseguido devolver o filme.
             * Procura o filme no banco de dados
             */
            database.Movie.findOne(
            { 
               where: 
               {
                  id: req.body.id
               } 
            })
            .then(movie => 
            {
               /* 
                * Se o filme foi encontrado significa que o usuŕio não alugou ou já devolveu
                * o filme 
                */
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
                  errors.push(" movie with id " + req.body.id + " not found");
                  
                  res.status(400).json({errors});
               }
            });
         }
      })
      .catch((error) =>
      {
         res.status(500).json({error});
      });
   });
};