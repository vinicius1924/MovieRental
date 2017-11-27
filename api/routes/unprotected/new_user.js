const Utils = require("../../utils/utils");

module.exports = (app, database) =>
{
   app.route("/new_user")
   .post((req, res) =>
   {
      console.log("chamei POST /new_user");
      // console.log("req.body.name = " + req.body.name);
      // console.log("req.body.email = " + req.body.email);
      //console.log("req.body.password = " + req.body.password);

      const user = database.User.build(
         {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
         });

      user.save().then(() =>
      {
         res.status(200).json({message: "User saved with success!"});
      }).catch((error) =>
      {
         let errors = Utils.parseSequelizeErrors(error);
         res.status(500).json({errors});
      });
   });
};