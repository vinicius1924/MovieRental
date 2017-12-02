module.exports = (models) =>
{
   const queries = {};

   const findMovie = (id, res) =>
   {
      /* Procura os dados do filme que foi alugado e retorna como resposta */
      return models.Movie.findOne(
      { 
         where: 
         {
            id: id
         } 
      })
      .catch((error) =>
      {
         let errors = Utils.parseSequelizeErrors(error);
         res.status(500).json({errors});
      });
   };

   queries.findMovie = findMovie;

   return queries;
};