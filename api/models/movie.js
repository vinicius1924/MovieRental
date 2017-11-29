module.exports = (sequelize, Sequelize) =>
{
   const Movie = sequelize.define("movie", 
   {
      id:
      {
         type: Sequelize.INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },

      movie_rental_id:
      {
         type: Sequelize.INTEGER,
         allowNull: false,
         validate:
         {
            notNull: { msg: "movie_rental_id required" }
         }
      },

      title:
      {
         type: Sequelize.STRING(100), 
         allowNull: false,
         validate:
         {
            notNull: { msg: "title required" }
         }
      },

      director:
      {
         type: Sequelize.STRING(100), 
         allowNull: false,
         validate:
         {
            notNull: { msg: "title required" }
         }
      },

      number_of_copies:
      {
         type: Sequelize.SMALLINT, 
         allowNull: false,
         validate:
         {
            isNumeric: { msg: "only numbers allowed in number_of_copies" },
            notNull: { msg: "number_of_copies required" },
            
            max: 
            {
               args: [65535],
               msg: "number_of_copies maximum value is 65535"
            },

            min: 
            {
               args: [0],
               msg: "number_of_copies minimum value is 0"
            }
         }
      },

      located_copies:
      {
         type: Sequelize.SMALLINT, 
         allowNull: false,
         validate:
         {
            isNumeric: { msg: "only numbers allowed in located_copies" },
            notNull: { msg: "located_copies required" },
            
            max: 
            {
               args: [65535],
               msg: "located_copies maximum value is 65535"
            },

            min: 
            {
               args: [0],
               msg: "located_copies minimum value is 0"
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

   return Movie;
};