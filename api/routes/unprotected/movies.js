module.exports = (app, database) =>
{
   app.route("/movies")
   .get((req, res) =>
   {
      database.sequelize.query("SELECT movie.id, movie.title, movie.director, " + 
      "(movie.number_of_copies - movie.located_copies) AS available_copies " +
      "FROM movie",
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
            errors.push("no movies found");
            res.status(404).json({errors});
         }
      });
   });
};