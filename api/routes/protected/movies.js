module.exports = (router, database) =>
{
   router.route("/movies")
   .get((req, res) =>
   {
      database.sequelize.query("SELECT movie.id, movie.title, movie.director, " +
      "(movie.number_of_copies - movie.located_copies) " +
      "AS available_copies " +
      "FROM movie " +
      "WHERE (movie.number_of_copies - movie.located_copies) > 0",
      { 
         type: database.sequelize.QueryTypes.SELECT
      })
      .then((movies) => 
      {
         if(movies.length != 0)
         {
            res.status(200).json({movies});
         }
         else
         {
            let errors = [];
            errors.push("no available movies for rent");
            res.status(500).json({errors});
         }
      });
   });
};