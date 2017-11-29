module.exports = (router, database) =>
{
   router.route("/search_movie_by_name/:name")
   .get((req, res) =>
   {
      database.sequelize.query("SELECT movie.id, movie.title, movie.director, " + 
      "(movie.number_of_copies - movie.located_copies) " +
      "AS available_copies " +
      "FROM movie " +
      "WHERE movie.title " +
      "LIKE :name", 
      { 
         replacements: 
         { 
            name: "%" + req.params.name + "%"
         }, 
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
            errors.push("No movies found");
            res.status(500).json({errors});
         }
      });
   });
};