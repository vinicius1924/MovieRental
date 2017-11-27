const Utils = require("../../utils/utils");
const _ = require("lodash");

module.exports = (router, database) =>
{
   router.route("/movie_return")
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
                     model: database.UserRentedMovie,
                     where:
                     {
                        user_id:
                        {
                           $eq: req.decodedToken.id
                        },

                        movie_id:
                        {
                           $eq: req.body.id
                        }
                     }
                  }
               ]
            })
            .then(movie =>
            {
               if(movie)
               {
                  /* 
                   * Testa se o número de cópias que se quer devolver, é menor ou igual 
                   * ao número de cópias que foram alugadas
                   */
                  if(parseInt(req.body.amount) <= movie.user_rented_movies[0].quantity)
                  {
                     /* 
                      * Diminui o número de cópias que se quer devolver no número de cópias 
                      * locadas do filme e atualiza no banco de dados 
                      */
                     movie.update(
                     {
                        located_copies: movie.located_copies - parseInt(req.body.amount)
                     })
                     .then((updatedMovie) =>
                     {
                        if((updatedMovie.user_rented_movies[0].quantity - 
                           parseInt(req.body.amount)) == 0)
                        {
                           updatedMovie.user_rented_movies[0].destroy();

                           res.status(200).json(
                           {
                              success: "You returned " + req.body.amount +
                              " copies of the movie " + updatedMovie.title
                           });
                        }
                        else
                        {
                           updatedMovie.user_rented_movies[0].update(
                           {
                              quantity: updatedMovie.user_rented_movies[0].quantity - 
                              parseInt(req.body.amount)
                           })
                           .then((updatedUserRentedMovies) =>
                           {
                              res.status(200).json(
                              {
                                 success: "You returned " + req.body.amount +
                                 " copies of the movie " + updatedMovie.title
                              });
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

                     errors.push("You are trying to return " + req.body.amount + " copies " + 
                     "of the movie but you rented " + movie.user_rented_movies[0].quantity);
                     res.status(500).json({errors});
                  }
               }
               else
               {
                  let errors = [];
                  errors.push("You not rented this movie or it does not exist");
                  res.status(500).json({errors});
               }
            });
         }
         else
         {
            let errors = [];
            errors.push("You need to send the amount of that movie that you want to return");
            res.status(500).json({errors});
         }
      }
      else
      {
         let errors = [];
         errors.push("You need to send the id of movie that you want to return");
         
         if(!req.body.amount)
         {
            errors.push("You need to send the amount of that movie that you want to return");
         }

         res.status(500).json({errors});
      }
   });
};