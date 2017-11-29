const Utils = require("../../utils/utils");

module.exports = (router, database) =>
{
   router.route("/logout")
   .get((req, res) =>
   {
      database.User.update(
      {
         token: " "
      },
      {
         where:
         {
            id: req.decodedToken.id
         }
      })
      .then(() =>
      {
         res.status(200).json({message: "You have been successfully logged out!"});
      })
      .catch((error) =>
      {
         let errors = Utils.parseSequelizeErrors(error);
         res.status(500).json({errors});
      });
   });
};