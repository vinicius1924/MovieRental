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

   const findUserById = (id, res) =>
   {
      /* Procura os dados do filme que foi alugado e retorna como resposta */
      return models.User.findOne(
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

   const findUserByEmail = (email, res) =>
   {
      /* Procura os dados do filme que foi alugado e retorna como resposta */
      return models.User.findOne(
      {
         where:
         {
            email: email
         }
      })
      .catch((error) =>
      {
         let errors = Utils.parseSequelizeErrors(error);
         res.status(500).json({errors});
      });
   };

   queries.findMovie = findMovie;
   queries.findUserById = findUserById;
   queries.findUserByEmail = findUserByEmail;

   return queries;
};