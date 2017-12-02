module.exports = (Movie) =>
{
   const findMovie = (id, res) =>
   {
      /* Procura os dados do filme que foi alugado e retorna como resposta */
      return Movie.findOne(
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

   return findMovie;
};