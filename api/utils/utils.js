const _ = require("lodash");

const Utils = class Utils
{
   static parseSequelizeErrors(sequelizeError)
   {
      let arrayErrors = [];

      _.forIn(sequelizeError.errors, (error) => 
      {
         if(error.message.indexOf("_UNIQUE") !== -1)
         {
            if(error.path == "email_UNIQUE")
            {
               arrayErrors.push("email already in use");
            }
            else
            {
               arrayErrors.push(error.message.replace("_UNIQUE", ""));
            }
         }
         else
         {
            arrayErrors.push(error.message)
         }
      });
      
      return arrayErrors;
   }
};

module.exports = Utils;