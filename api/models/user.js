const bcrypt = require("bcrypt");

module.exports = (sequelize, Sequelize) =>
{
   const User = sequelize.define("user", 
   {
      id:
      {
         type: Sequelize.INTEGER,
         primaryKey: true,
         autoIncrement: true,
      },

      name:
      {
         type: Sequelize.STRING, 
         allowNull: false,
         validate:
         {
            notNull: { msg: "name required" }
         }
      },

      email: 
      {
         type: Sequelize.STRING, 
         allowNull: false,
         unique: true,
         validate:
         {
            isEmail: { msg: "invalid email" },
            notNull: { msg: "email required" }
         }
      },

      password:
      {
         type: Sequelize.STRING, 
         allowNull: false,
         validate:
         {
            len:
            {
               args: [1, 20],
               msg: "The password must have at least 1 character and a maximum of 20 characters"
            },
            notNull: { msg: "password required" }
         }
      },

      token:
      {
         type: Sequelize.STRING
      }
   },
   {
      /* 
      * Faz com que o nome do modelo não seja transformado para o plural.
      * Como no meu banco de dados eu tenho uma tabela chamada "user",
      * se esse atributo não estivesse definido o sequelize iria tentar
      * fazer inserções em uma tabela chamada "users"
      */
      freezeTableName: true,

      /* Não adiciona os atributos de timestamp(updatedAt, createdAt) */
      timestamps: false
   });

   User.beforeCreate((user, options) =>
   {
      //console.log("beforeCreate called");
      let hash = bcrypt.hashSync(user.password, 10);
      user.password = hash;
   });

   return User;
};