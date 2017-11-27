module.exports = (router, database) =>
{
   router.route("/movies")
   .get((req, res) =>
   {
      database.Movie.findAll(
      {
         attributes: ["title", "director"],
         /* 
          * a cláusula where implementada abaixo somente irá mostrar os filmes 
          * que estão disponíveis para ser alugados
          */
         where:
         { 
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