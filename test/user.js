const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index").app;
const database = require("../index").database;
const should = chai.should();

chai.use(chaiHttp);

describe("new_user.js", () =>
{
   /* Executa uma vez antes de cada caso de teste */
   beforeEach((done) =>
   {
      database.models.User.destroy({
         where: {}
      })
      .then(() =>
      {
         done();
      });
   });

   describe("POST /user", () => {
      it("it should create a new user", (done) => 
      {
         let user = 
         {
            name: "Cafumango",
            email: "cafumango@email.com",
            password: "cafumango"
         };

         chai.request(server)
         .post("/new_user")
         .send(user)
         .end((err, res) => 
         {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message');
            res.body.message.should.be.eql('User saved with success!');            
            done();
         });
      });
   });
});

describe("login.js", () =>
{
   describe("POST /login", () =>
   {
      /* Executa uma vez antes do primeiro caso de teste */
      before((done) =>
      {
         database.models.User.destroy({
            where: {}
         })
         .then(() =>
         {
            done();
         });
      });

      it("it should create a new user", (done) => 
      {
         let user = 
         {
            name: "Cafumango",
            email: "cafumango@email.com",
            password: "cafumango"
         };

         chai.request(server)
         .post("/new_user")
         .send(user)
         .end((err, res) => 
         {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message');
            res.body.message.should.be.eql('User saved with success!');            
            done();
         });
      });

      it("it should login a user", (done) => 
      {
         let user = 
         {
            email: "cafumango@email.com",
            password: "cafumango"
         };

         chai.request(server)
         .post("/login")
         .send(user)
         .end((err, res) => 
         {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("name");
            res.body.should.have.property("email");
            res.body.should.have.property("token");
            res.body.email.should.be.eql("cafumango@email.com");

            done();
         });
      });
   });
});

describe("logout.js", () =>
{
   describe("GET /api/logout", () =>
   {
      /* Executa uma vez antes do primeiro caso de teste */
      before((done) =>
      {
         database.models.User.destroy({
            where: {}
         })
         .then(() =>
         {
            done();
         });
      });

      let token = null;

      it("it should create a new user", (done) => 
      {
         let user = 
         {
            name: "Cafumango",
            email: "cafumango@email.com",
            password: "cafumango"
         };

         chai.request(server)
         .post("/new_user")
         .send(user)
         .end((err, res) => 
         {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message');
            res.body.message.should.be.eql('User saved with success!');            
            done();
         });
      });

      it("it should login a user", (done) => 
      {
         let user = 
         {
            email: "cafumango@email.com",
            password: "cafumango"
         };

         chai.request(server)
         .post("/login")
         .send(user)
         .end((err, res) => 
         {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("name");
            res.body.should.have.property("email");
            res.body.should.have.property("token");
            res.body.email.should.be.eql("cafumango@email.com");

            token = res.body.token;

            done();
         });
      });

      it("it should logout a user", (done) => 
      {
         chai.request(server)
         .get("/api/logout")
         .set("Authorization", `Bearer ${token}`)
         .end((err, res) =>
         {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message");
            res.body.message.should.be.eql("You have been successfully logged out!");

            done();
         });
      });
   });
});

