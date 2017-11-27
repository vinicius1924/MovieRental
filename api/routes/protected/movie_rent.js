const Utils = require("../../utils/utils");
const _ = require("lodash");

module.exports = (router, database) =>
{
   router.route("/movie_rent")
   .post((req, res) =>
   {
      if(req.body.id)
      {
         if(req.body.amount)
         {
            database.Movie.findOne(
            {
               where:
               {
                  id: 
                  { 
                     $eq: req.body.id
                  }
               },

               include: 
               [
                  {
                     model: database.UserRentedMovie
                  }
               ]
            })
            .then(movie =>
            {
               if(movie)
               {
                  /* 
                   * Testa se o número de cópias que se quer alugar é menor que o número de cópias
                   * disponiveis para locação
                   */
                  if(parseInt(req.body.amount) <= (movie.number_of_copies - movie.located_copies))
                  {
                     /* 
                      * Soma o número de cópias que se quer alugar no número de cópias 
                      * locadas do filme e atualiza no banco de dados 
                      */
                     movie.update(
                     {
                        located_copies: movie.located_copies + parseInt(req.body.amount)
                     })
                     .then((updatedMovie) =>
                     {
                        /*
                         * Significa que esse filme já foi alugado por alguém, portanto
                         * devemos verificar dentro desse array, se o filme já foi alugado
                         * pela mesma pessoa que está tentando alugar no momento.
                         * Caso a pessoa já tenha alugado o filme então devemos atualizar
                         * o campo "quantity" da tabela "user_rented_movies"
                         */
                        if(updatedMovie.user_rented_movies.length > 0)
                        {
                           let movieIsRentedByThisUser = false;

                           _.forIn(updatedMovie.user_rented_movies, (userRentedMovie) => 
                           {
                              if(userRentedMovie.user_id == req.decodedToken.id)
                              {
                                 movieIsRentedByThisUser = true;
                                 /* 
                                  * Atualiza a tabela "user_rented_movie" com a quantidade
                                  * que o usuário alugou desse filme
                                  */
                                 userRentedMovie.update(
                                 {
                                    quantity: userRentedMovie.quantity +
                                    parseInt(req.body.amount)
                                 })
                                 .then((updatedUserRentedMovie) =>
                                 {
                                    res.status(200).json(
                                    {
                                       id: updatedMovie.id,
                                       title: updatedMovie.title,
                                       director: updatedMovie.director
                                    });
                                 })
                                 .catch(error =>
                                 {
                                    let errors = Utils.parseSequelizeErrors(error);
                                    res.status(500).json({errors});
                                 });
                              }
                           });

                           if(!movieIsRentedByThisUser)
                           {
                              /* 
                               * Adiciona na tabela "user_rented_movie" o id do usuário, o id
                               * do filme que ele alugou e a quantidade que ele alugou desse filme
                               */
                              const userRentedMovie = database.UserRentedMovie.build(
                              {
                                 user_id: req.decodedToken.id,
                                 movie_id: updatedMovie.id,
                                 quantity: req.body.amount
                              });
      
                              userRentedMovie.save().then(() =>
                              {
                                 res.status(200).json(
                                 {
                                    id: updatedMovie.id,
                                    title: updatedMovie.title,
                                    director: updatedMovie.director
                                 });
                              })
                              .catch((error) =>
                              {
                                 let errors = Utils.parseSequelizeErrors(error);
                                 res.status(500).json({errors});
                              });
                           }
                        }
                        else
                        {
                           /* 
                            * Adiciona na tabela "user_rented_movie" o id do usuário, o id
                            * do filme que ele alugou e a quantidade que ele alugou desse filme
                            */
                           const userRentedMovie = database.UserRentedMovie.build(
                           {
                              user_id: req.decodedToken.id,
                              movie_id: updatedMovie.id,
                              quantity: req.body.amount
                           });
   
                           userRentedMovie.save().then(() =>
                           {
                              res.status(200).json(
                              {
                                 id: updatedMovie.id,
                                 title: updatedMovie.title,
                                 director: updatedMovie.director
                              });
                           })
                           .catch((error) =>
                           {
                              let errors = Utils.parseSequelizeErrors(error);
                              res.status(500).json({errors});
                           });
                        }
                     })
                     .catch(error =>
                     {
                        let errors = Utils.parseSequelizeErrors(error);
                        res.status(500).json({errors});
                     });
                  }
                  else
                  {
                     let errors = [];

                     if(movie.located_copies == movie.number_of_copies)
                     {
                        errors.push("There are no available copies of this movie");
                        res.status(500).json({errors});
                     }
                     else
                     {
                        let numberOfCopiesAvailable = movie.number_of_copies - movie.located_copies;
                        errors.push("We only have " + numberOfCopiesAvailable + 
                        " copies available of this movie");
                        res.status(500).json({errors});
                     }
                  }
               }
               else
               {
                  let errors = [];
                  errors.push("Movie not found");
                  res.status(500).json({errors});
               }
            });
         }
         else
         {
            let errors = [];
            errors.push("You need to send the amount of movies that you want to rent");
            res.status(500).json({errors});
         }
      }
      else
      {
         let errors = [];
         errors.push("You need to send the id of movie that you want to rent");
         
         if(!req.body.amount)
         {
            errors.push("You need to send the amount of movies that you want to rent");
         }

         res.status(500).json({errors});
      }
   });
};