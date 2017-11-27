module.exports = (router, database) =>
{
   router.route("/search_movie_by_name/:name")
   .get((req, res) =>
   {
      database.Movie.findAll(
      {
         attributes: ["id", "title", "director"],
         
         where:
         { 
            title: 
            { 
               $like: "%" + req.params.name + "%"
            },

            /* 
             * o que está abaixo irá mostrar somente os filmes 
             * que estão disponíveis para ser alugados
             */
            located_copies: 
            { 
               $lt: database.sequelize.col("number_of_copies")
            }
         }
      })
      .then(movies => 
      {
         if(movies.length != 0)
         {
            res.status(200).json({movies});
         }
         else
         {
            let errors = [];
            errors.push("No movies found");
            res.status(500).json({errors});
         }
      });
   });
};