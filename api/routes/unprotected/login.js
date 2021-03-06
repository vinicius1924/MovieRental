/* jsonwebtoken é usado para criar, assinar e verificar tokens */
const jwt = require("jsonwebtoken");
const env = require("../../../config/.env");
const bcrypt = require("bcrypt");

let handleUserNotFoundOrInvalidPassword = (res) =>
{
   let errors = [];
   errors.push("username/password invalid");
   res.status(404).json({errors});
};

let handleUserFound = (user, email, password, res) =>
{
   /* Compara a senha digitada pelo usuário com a senha do banco de dados */
   bcrypt.compare(password, user.password).then((response) =>
   {
      /* se response == true então a senha digitada pelo usuário está certa */
      if(response)
      {
         /* 
          * Se a senha está correta cria um token com validade de 1 hora e devolve 
          * para o usuário
          */
         const token = jwt.sign({id: user.id, email: email}, env.jsonWebTokenSecret,
         {
            expiresIn: "1d" // token expira em 1 dia
         });

         user.update(
         {
            token: token
         })
         .then(() =>
         {
            res.status(200).json({name: user.name, email: user.email, token: token});
         });
      }
      else
      {
         handleUserNotFoundOrInvalidPassword(res);
      }
   });
};

let checkIfEmailWasSent = (email) =>
{
   if(email)
   {
      return true;
   }
   else
   {
      return false;
   }
};

let checkIfPasswordWasSent = (password) =>
{
   if(password)
   {
      return true;
   }
   else
   {
      return false;
   }
};

module.exports = (app, database) =>
{
   app.route("/login")
   .post((req, res) =>
   {
      if(checkIfEmailWasSent(req.body.email) && checkIfPasswordWasSent(req.body.password))
      {
         database.queries.findUserByEmail(req.body.email, res)
         .then(user => 
         {
            /* 
             * o parametro user será a primeira entrada da tabela user com o email enviado no corpo 
             * da requisição ou null
             */
            if(user)
            {
               handleUserFound(user, req.body.email, req.body.password, res);
            }
            else
            {
               handleUserNotFoundOrInvalidPassword(res);
            }
         })
         .catch((error) =>
         {
            let errors = Utils.parseSequelizeErrors(error);
            res.status(500).json({errors});
         });
      }
      else
      {
         let errors = [];

         if(!checkIfEmailWasSent(req.body.email))
         {
            errors.push("email must be sent");
         }

         if(!checkIfPasswordWasSent(req.body.password))
         {
            errors.push("password must be sent");
         }

         res.status(500).json({errors});
      }
   });
};