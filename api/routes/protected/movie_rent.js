const Utils = require("../../utils/utils");
const _ = require("lodash");

const findMovie = (id, database) =>
{
   /* Procura os dados do filme que foi alugado e retorna como resposta */
   return database.Movie.findOne(
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

const handleMovieNotRented = (database, req, res) =>
{
   /* 
    * Caso o usuário não tenha conseguido alugar o filme.
    * Procura o filme no banco de dados
    */
   findMovie(req.body.id, database)
   .then(movie => 
   {
      /* Se o filme foi encontrado significa que não haviam copias disponíveis */
      if(movie)
      {
         let errors = [];
         errors.push("movie with id " + req.body.id + " not available for rent");

         res.status(404).json({errors});
      }
      else
      {
         /* 
          * Se o filme NÃO foi encontrado significa que foi enviado um id que não existe
          * no banco de dados 
          */
         let errors = [];
         errors.push("movie with id " + req.body.id + " not found");
         
         res.status(400).json({errors});
      }
   })
   .catch((error) =>
   {
      let errors = Utils.parseSequelizeErrors(error);
      res.status(500).json({errors});
   });
};

const handleMovieRented = (database, req, res) =>
{
   /* 
    * insere na tabela "user_rented_movie" o id do usuário e o id do filme
    * que ele alugou 
    */
   const userRentedMovie = database.UserRentedMovie.build(
   {
      user_id: req.decodedToken.id,
      movie_id: req.body.id
   });

   userRentedMovie.save()
   .then(() =>
   {
      findMovie(req.body.id, database)
      .then((movie) =>
      {
         res.status(200).json(
         {
            id: movie.id, 
            title: movie.title, 
            director: movie.director
         });
      });
   })
   .catch((error) =>
   {
      let errors = Utils.parseSequelizeErrors(error);
      res.status(500).json({errors});
   });
};

const handleUpdateQueryResult = (result) =>
{
   return new Promise((resolve, reject) => 
   {
      /* 
       * Testa se alguma linha foi afetada pelo update. Se foi alterada significa
       * que o filme estava disponível e foi alugado pelo usuário 
       */
      if(result[1] == 1)
      {
         resolve(true);
      }
      else
      {
         reject(false);
      }
   });
};

module.exports = (router, database) =>
{
   router.route("/movie_rent")
   .post((req, res) =>
   {
      /* 
       * Atualiza o campo located_copies da tabela movie, somando 1, caso o numero de 
       * copias existentes, menos o numero de copias alugadas, seja maior que zero 
       */
      database.sequelize.query("UPDATE movie SET located_copies = located_copies + 1 " +
      "WHERE (movie.number_of_copies - movie.located_copies) > 0 " +
      "AND movie.id = :id",
      { 
         replacements: 
         { 
            id: req.body.id
         },
         
         type: database.sequelize.QueryTypes.UPDATE
      })
      .then(handleUpdateQueryResult)
      .then((result) =>
      {
         handleMovieRented(database, req, res);
      },
      (error) =>
      {
         handleMovieNotRented(database, req, res);
      })
      .catch((error) =>
      {
         let errors = Utils.parseSequelizeErrors(error);
         res.status(500).json({errors});
      });
   });
};