module.exports = (sequelize, Sequelize) =>
{
   const MovieRental = sequelize.define("movie_rental", 
   {
      id:
      {
         type: Sequelize.INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },

      name:
      {
         type: Sequelize.STRING(100), 
         allowNull: false,
         validate:
         {
            notNull: { msg: "name required" }
         }
      }
   },
   {
      /* 
       * Faz com que o nome do modelo não seja transformado para o plural.
       * Como no meu banco de dados eu tenho uma tabela chamada "movie_rental",
       * se esse atributo não estivesse definido o sequelize iria tentar
       * fazer inserções em uma tabela chamada "movie_rentals"
       */
      freezeTableName: true,

      /* Não adiciona os atributos de timestamp(updatedAt, createdAt) */
      timestamps: false,
   });

   return MovieRental;
};