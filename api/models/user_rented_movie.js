module.exports = (sequelize, Sequelize) =>
{
   const UserRentedMovie = sequelize.define("user_rented_movie",
   {
      // id:
      // {
      //    type: Sequelize.INTEGER,
      //    primaryKey: true,
      //    autoIncrement: true,
      // },

      quantity:
      {
         type: Sequelize.SMALLINT, 
         allowNull: false,
         validate:
         {
            isNumeric: { msg: "only numbers allowed in quantity" },
            notNull: { msg: "quantity required" },
            
            max: 
            {
               args: [65535],
               msg: "quantity maximum value is 65535"
            },

            min: 
            {
               args: [0],
               msg: "quantity minimum value is 0"
            }
         }
      }
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