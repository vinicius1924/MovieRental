const Utils = require("../../utils/utils");

module.exports = (app, database) =>
{
   app.route("/new_user")
   .post((req, res) =>
   {
      const user = database.User.build(
      {
         name: req.body.name,
         email: req.body.email,
         password: req.body.password
      });

      user.save()
      .then(() =>
      {
         res.status(200).json({message: "User saved with success!"});
      })
      .catch((error) =>
      {
         let errors = Utils.parseSequelizeErrors(error);
         res.status(500).json({errors});
      });
   });
};