const Utils = require("../../utils/utils");
const _ = require("lodash");

module.exports = (router, database) =>
{
   router.route("/movie_rent")
   .post((req, res) =>
   {
      if(req.body.id && Array.isArray(req.body.id) && (req.body.id.length > 0))
      {
         database.Movie.findAll(
         {
            where:
            {
               id: 
               { 
                  $in: req.body.id
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
            /* Testa se algum filme foi encontrado ao procurar no banco de dados */
            if(movie.length > 0)
            {
               /* 
                * Testa se o número de filmes encontrados é diferente que o número de
                * filmes enviados 
                */
               if(movie.length != req.body.id.length)
               {
                  /* 
                   * Se nem todos os filmes foram encontrados então procura quais filmes
                   * não foram encontrados e manda uma mensagem de erro informando quais foram 
                   * os ids não encontrados 
                   */
                  let notFoundMovies = [];

                  _.forIn(req.body.id, (id) => 
                  {
                     let found = false;
                     _.forIn(movie, (movieInstance) => 
                     {
                        if(id == movieInstance.id)
                        {
                           found = true;
                        }
                     });

                     if(!found)
                     {
                        notFoundMovies.push(id);
                     }
                  });

                  /* TODO: Mandar erro dizendo os ids dos filmes que não foram encontrados */
                  let errors = [];

                  if(notFoundMovies.length > 1)
                  {
                     errors.push("movies with ids " + notFoundMovies.toString() + " were not found");
                  }
                  else
                  {
                     errors.push("movie with id " + notFoundMovies.toString() + " were not found");
                  }
         
                  res.status(400).json({errors});
               }
               else
               {
                  /* Vai chegar aqui nesse else se todos os filmes foram encontrados */

                  let amount = 1;
                  
                  /* Testa se a quantidade de cópias dos filmes que se quer alugar foi enviada */
                  if(req.body.amount)
                  {
                     /* 
                      * Se a quantidade de cópias dos filmes que se quer alugar foi enviada,
                      * então ela deve ser um array 
                      */
                     if(Array.isArray(req.body.amount))
                     {
                        /* 
                         * Testa se o array da quantidade de cópias tem o mesmo tamanho
                         * que o array dos filmes que se quer alugar 
                         */
                        if(req.body.amount.length == req.body.id.length)
                        {
                           amount = req.body.amount;
                        }
                        else
                        {
                           /* 
                            * Caso o array da quantidade de cópias NÃO tenha o mesmo tamanho
                            * que o array dos filmes que se quer alugar, responde com uma mesagem
                            * de erro apropriada
                            */
                           let errors = [];
                           errors.push("amount array must have the same size as the id array");
                  
                           res.status(400).json({errors});
                        }
                     }
                     else
                     {
                        let errors = [];
                        errors.push("amount must be an array");
               
                        res.status(400).json({errors});
                     }
                  }
   
                  let counter = 0; // conta o numero de iterações do forIn
                  /* armazena os erros que podem acontecer ao tentar alugar um filme */
                  let errors = [];
                  /* os filmes que serão atualizados na tabela "movie" */
                  let moviesToUpdate = [];
                  /* o que deve ser CRIADO na tabela "user_rented_movie" */
                  let userRentedMovieCreate = [];
                  /* o que deve ser ATUALIZADO na tabela "user_rented_movie" */
                  let userRentedMovieUpdate = [];

                  /* Percorre o array dos filmes encontrados que o usuário quer alugar */
                  _.forIn(movie, (movieInstance) => 
                  {
                     /* 
                      * Essa variável armazena a quantidade de cópias que o usuário quer
                      * alugar do filme 
                      */
                     let amountForRent = Array.isArray(amount) ? amount[counter] : amount;

                     /* 
                      * Testa se o número de cópias que se quer alugar é menor que o número de cópias
                      * disponiveis para locação
                      */
                     if(amountForRent <= (movieInstance.number_of_copies - movieInstance.located_copies))
                     {
                        /* atualiza na INSTÂNCIA do filme a quantidade de cópias locadas */
                        movieInstance.located_copies = movieInstance.located_copies + amountForRent;

                        /* 
                         * armazena o filme no array de filmes que serão atualizados 
                         * na tabela "movie"
                         */
                        moviesToUpdate.push(movieInstance);

                        /*
                         * Significa que esse filme já foi alugado por alguém, portanto
                         * devemos verificar dentro desse array, se o filme já foi alugado
                         * pela mesma pessoa que está tentando alugar no momento.
                         * Caso a pessoa já tenha alugado o filme então devemos atualizar
                         * o campo "quantity" do registro da tabela "user_rented_movies"
                         */
                        if(movieInstance.user_rented_movies)
                        {
                           if(movieInstance.user_rented_movies.length > 0)
                           {
                              let movieIsRentedByThisUser = false;

                              _.forIn(movieInstance.user_rented_movies, (userRentedMovie) => 
                              {
                                 if(userRentedMovie.user_id == req.decodedToken.id)
                                 {
                                    movieIsRentedByThisUser = true;

                                    let quantity;

                                    if(Array.isArray(amount))
                                    {
                                       quantity = userRentedMovie.quantity + amount[counter];
                                    }
                                    else
                                    {
                                       quantity = userRentedMovie.quantity + amount;
                                    }

                                    /* 
                                     * atualiza na INSTÂNCIA de userRentedMovie a quantidade 
                                     * de cópias locadas desse filme por essa pessoa
                                     */
                                    userRentedMovie.quantity = quantity;

                                    /* 
                                     * armazena o userRentedMovie no array de userRentedMovies que 
                                     * serão ATUALIZADOS na tabela "user_rented_movie"
                                     */
                                    userRentedMovieUpdate.push(userRentedMovie);
                                 }
                              });

                              if(!movieIsRentedByThisUser)
                              {
                                 /*
                                  * Cria uma instância de UserRentedMovie com o id do usuário, o id
                                  * do filme que ele quer alugar e a quantidade de cópias que ele 
                                  * quer alugar desse filme
                                  */
                                 const userRentedMovie = database.UserRentedMovie.build(
                                 {
                                    user_id: req.decodedToken.id,
                                    movie_id: movieInstance.id,
                                    quantity: amountForRent
                                 });
   
                                 /* 
                                  * armazena o userRentedMovie no array de userRentedMovies que 
                                  * serão CRIADOS na tabela "user_rented_movie"
                                  */
                                 userRentedMovieCreate.push(userRentedMovie);
                              }
                           }
                           else
                           {
                              /*
                               * Cria uma instância de UserRentedMovie com o id do usuário, o id
                               * do filme que ele quer alugar e a quantidade de cópias que ele 
                               * quer alugar desse filme
                               */
                              const userRentedMovie = database.UserRentedMovie.build(
                              {
                                 user_id: req.decodedToken.id,
                                 movie_id: movieInstance.id,
                                 quantity: amountForRent
                              });

                              /* 
                               * armazena o userRentedMovie no array de userRentedMovies que 
                               * serão CRIADOS na tabela "user_rented_movie"
                               */
                              userRentedMovieCreate.push(userRentedMovie);
                           }
                        }
                     }
                     else
                     {
                        if(movieInstance.located_copies == movieInstance.number_of_copies)
                        {
                           errors.push("There are no available copies of the movie with id " + 
                           movieInstance.id);
                        }
                        else
                        {
                           let numberOfCopiesAvailable = movieInstance.number_of_copies - 
                           movieInstance.located_copies;
                           errors.push("We only have " + numberOfCopiesAvailable + 
                           " copies available of the movie with id " + movieInstance.id);
                        }
                     }

                     counter++;
                  });

                  /* 
                   * Caso tenha ocorrido algum erro então é enviado uma resposta contendo
                   * os erros 
                   */
                  if(errors.length > 0)
                  {
                     res.status(400).json({errors});
                  }
                  else
                  {
                     /* 
                      * Chega nesse else se todos os filmes foram encontrados e se
                      * a quantidade de cópias que se quer alugar desses filmes está disponível 
                      */
                     
                      /* Armazena os filmes que serão enviados na resposta da requisição */
                     let response = [];
                     let numberOfMovieUpdates = 0;
                     let numberOfUserRentedMovieCreate = 0;
                     let numberOfUserRentedMovieUpdates = 0;

                     _.forIn(moviesToUpdate, (movie) => 
                     {
                        let movieResponse = {};

                        movieResponse.id = movie.id;
                        movieResponse.title = movie.title;
                        movieResponse.director = movie.director;

                        response.push(movieResponse);

                        movie.update(
                        {
                           located_copies: movie.located_copies
                        })
                        .then((updatedMovie) =>
                        {
                           ++numberOfMovieUpdates;

                           if(numberOfMovieUpdates == req.body.id.length)
                           {
                              if(userRentedMovieCreate.length > 0)
                              {
                                 _.forIn(userRentedMovieCreate, (userRentedMovieCreateInstance) => 
                                 {
                                    userRentedMovieCreateInstance.save()
                                    .then(() =>
                                    {
                                       ++numberOfUserRentedMovieCreate;

                                       if(numberOfUserRentedMovieCreate == userRentedMovieCreate.length)
                                       {
                                          if(userRentedMovieUpdate.length > 0)
                                          {
                                             _.forIn(userRentedMovieUpdate, (userRentedMovieUpdateInstance) =>
                                             {
                                                userRentedMovieUpdateInstance.update(
                                                {
                                                   quantity: userRentedMovieUpdateInstance.quantity
                                                })
                                                .then((updatedUserRentedUpdateMovie) =>
                                                {
                                                   ++numberOfUserRentedMovieUpdates;
         
                                                   if(numberOfUserRentedMovieUpdates == userRentedMovieUpdate.length)
                                                   {
                                                      res.status(200).json({movies: response});
                                                   }
                                                });
                                             }); 
                                          }
                                          else
                                          {
                                             res.status(200).json({movies: response});
                                          }
                                       }
                                    }).catch((error) =>
                                    {
                                       let errors = Utils.parseSequelizeErrors(error);
                                       res.status(500).json({errors});
                                    });
                                 });
                              }
                              else
                              {
                                 if(userRentedMovieUpdate.length > 0)
                                 {
                                    _.forIn(userRentedMovieUpdate, (userRentedMovieUpdateInstance) =>
                                    {
                                       userRentedMovieUpdateInstance.update(
                                       {
                                          quantity: userRentedMovieUpdateInstance.quantity
                                       })
                                       .then((updatedUserRentedUpdateMovie) =>
                                       {
                                          ++numberOfUserRentedMovieUpdates;

                                          if(numberOfUserRentedMovieUpdates == userRentedMovieUpdate.length)
                                          {
                                             res.status(200).json({movies: response});
                                          }
                                       });
                                    }); 
                                 }
                                 else
                                 {
                                    res.status(200).json({movies: response});
                                 }
                              }
                           }
                        });
                     });

                     // database.Movie.bulkUpdate(moviesToUpdate)
                     // .then(() =>
                     // {
                     //    if(userRentedMovieCreate.length > 0)
                     //    {
                     //       database.UserRentedMovie.bulkCreate(userRentedMovieCreate)
                     //       .then(() =>
                     //       {
                     //          if(userRentedMovieUpdate.length > 0)
                     //          {
                     //             database.UserRentedMovie.bulkUpdate(userRentedMovieUpdate)
                     //             .then(() =>
                     //             {
                     //                res.status(200).json({movies: moviesToUpdate});
                     //             });
                     //          }
                     //       });
                     //    }
                     //    else
                     //    {
                     //       if(userRentedMovieUpdate.length > 0)
                     //       {
                        /* 
                                        * Atualiza a tabela "user_rented_movie" com a quantidade
                                        * que o usuário alugou desse filme
                                        */
                     //          database.UserRentedMovie.bulkUpdate(userRentedMovieUpdate)
                     //          .then(() =>
                     //          {
                     //             res.status(200).json({movies: moviesToUpdate});
                     //          });
                     //       }
                     //    }
                     // });
                  }
               }
            }
            else
            {
               /* 
                * Nenhum filme, com os ids enviados na requisição, foi encontrado 
                * na consulta ao banco de dados 
                */
               let errors = [];

               if(req.body.id.length > 1)
               {
                  errors.push("Movies not found");
               }
               else
               {
                  errors.push("Movie not found");
               }

               res.status(400).json({errors});
            }
         });
      }
      else
      {
         let errors = [];
         errors.push("You need to send an array with the ids of movies that you want to rent");

         res.status(400).json({errors});
      }
   });
};