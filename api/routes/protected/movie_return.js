const Utils = require("../../utils/utils");
const _ = require("lodash");

module.exports = (router, database) =>
{
   router.route("/movie_return")
   .post((req, res) =>
   {
      if(req.body.id)
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
                  * Pega a quantidade de cópias que se quer alugar caso tenha sido mandado
                  * na requisição, senão utiliza 1 como número de cópias 
                  */
               let amount = req.body.amount ? parseInt(req.body.amount) : 1;

               /* 
                  * Testa se o número de cópias que se quer devolver, é menor ou igual 
                  * ao número de cópias que foram alugadas
                  */
               if(amount <= movie.user_rented_movies[0].quantity)
               {
                  /* 
                     * Diminui o número de cópias que se quer devolver no número de cópias 
                     * locadas do filme e atualiza no banco de dados 
                     */
                  movie.update(
                  {
                     located_copies: movie.located_copies - amount
                  })
                  .then((updatedMovie) =>
                  {
                     if((updatedMovie.user_rented_movies[0].quantity - amount) == 0)
                     {
                        updatedMovie.user_rented_movies[0].destroy();

                        res.status(200).json(
                        {
                           success: "You returned " + amount +
                           " copies of the movie " + updatedMovie.title
                        });
                     }
                     else
                     {
                        updatedMovie.user_rented_movies[0].update(
                        {
                           quantity: updatedMovie.user_rented_movies[0].quantity - amount
                        })
                        .then((updatedUserRentedMovies) =>
                        {
                           res.status(200).json(
                           {
                              success: "You returned " + amount +
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

                  errors.push("You are trying to return " + amount + " copies " + 
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
         errors.push("You need to send the id of movie that you want to return");

         res.status(500).json({errors});
      }
   });
};