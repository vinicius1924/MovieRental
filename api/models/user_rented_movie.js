module.exports = (sequelize, Sequelize) =>
{
   const UserRentedMovie = sequelize.define("user_rented_movie",
   {
      
   },
   {
      /* 
       * Faz com que o nome do modelo não seja transformado para o plural.
       * Como no meu banco de dados eu tenho uma tabela chamada "movie",
       * se esse atributo não estivesse definido o sequelize iria tentar
       * fazer inserções em uma tabela chamada "movies"
       */
      freezeTableName: true,

      /* Não adiciona os atributos de timestamp(updatedAt, createdAt) */
      timestamps: false
   });

   return UserRentedMovie;
};