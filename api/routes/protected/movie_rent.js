const Utils = require("../../utils/utils");
const _ = require("lodash");

module.exports = (router, database) =>
{
   router.route("/movie_rent")
   .post((req, res) =>
   {
      /* 
       * Atualiza o campo located_copies da tabela movie, somando 1, caso o numero de 
       * copias existentes, menos o numero de copias alugadas, seja maior que zero 
       */
      database.sequelize.query("UPDATE movie SET located_copies = located_copies + 1 " +
      "WHERE (movie.number_of_copies - movie.located_copies) > 0 " +
      "AND movie.id = :id",
      { 
         replacements: 
         { 
            id: req.body.id
         },
         
         type: database.sequelize.QueryTypes.UPDATE
      })
      .then((result) => 
      {
         /* 
          * Testa se alguma linha foi afetada pelo update. Se foi alterada significa
          * que o filme estava disponível e foi alugado pelo usuário 
          */
         if(result[1] == 1)
         {
            /* 
             * insere na tabela "user_rented_movie" o id do usuário e o id do filme
             * que ele alugou 
             */
            const userRentedMovie = database.UserRentedMovie.build(
            {
               user_id: req.decodedToken.id,
               movie_id: parseInt(req.body.id)
            });
      
            userRentedMovie.save().then(() =>
            {
               /* Procura os dados do filme que foi alugado e retorna como resposta */
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
            /* 
             * Caso o usuário não tenha conseguido alugar o filme.
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
               /* Se o filme foi encontrado significa que não haviam copias disponíveis */
               if(movie)
               {
                  let errors = [];
                  errors.push("movie with id " + req.body.id + " not available for rent");

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
            });
         }
      })
      .catch((error) =>
      {
         res.status(500).json({error});
      });
   });
};