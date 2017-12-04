const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index").app;
const database = require("../index").database;
const should = chai.should();

chai.use(chaiHttp);

describe("movies.js", () =>
{
   
   describe("GET /movies", () =>
   {
      it("it should GET all the movies", (done) => 
      {
         chai.request(server)
         .get("/movies")
         .end((err, res) =>
         {
            res.should.have.status(200);
            res.body.movies.should.be.a("array");
            res.body.movies.length.should.be.eql(5);
            done();
         });
      });
   });

});

describe("search_movie.js", () =>
{
   describe("GET /search_movie_by_name", () =>
   {
      it("it should GET the movies that match with name 'the'", (done) => 
      {
         chai.request(server)
         .get("/search_movie_by_name/the")
         .end((err, res) =>
         {
            res.should.have.status(200);
            res.body.movies.should.be.a("array");
            res.body.movies.length.should.be.eql(3);
            done();
         });
      });
   });
});

describe("movie_rent.js", () =>
{
   describe("POST /api/movie_rent", () =>
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

      it("it should rent a movie", (done) =>
      {
         let movie = 
         {
            id: 1
         };

         chai.request(server)
         .post("/api/movie_rent")
         .set("Authorization", `Bearer ${token}`)
         .send(movie)
         .end((err, res) =>
         {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("id");
            res.body.should.have.property("title");
            res.body.should.have.property("director");
            res.body.id.should.be.eql(1);
            res.body.title.should.be.eql("The Shawshank Redemption");
            res.body.director.should.be.eql("Frank Darabont");

            done();
         });
      });

      /* Executa uma vez depois de todos os casos de teste */
      after((done) =>
      {
         database.models.UserRentedMovie.destroy({
            where: {}
         })
         .then(() =>
         {
            database.models.Movie.update(
            {
               located_copies: 0,
               
            },
            {
               where: 
               {
                  located_copies:
                  {
                     $gt: 0
                  }
               }
            })
            .then(() =>
            {
               done();
            });
         });
      });
   });
});


describe("movie_return.js", () =>
{
   describe("POST /api/movie_return", () =>
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

      it("it should rent a movie", (done) =>
      {
         let movie = 
         {
            id: 1
         };

         chai.request(server)
         .post("/api/movie_rent")
         .set("Authorization", `Bearer ${token}`)
         .send(movie)
         .end((err, res) =>
         {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("id");
            res.body.should.have.property("title");
            res.body.should.have.property("director");
            res.body.id.should.be.eql(1);
            res.body.title.should.be.eql("The Shawshank Redemption");
            res.body.director.should.be.eql("Frank Darabont");

            done();
         });
      });

      it("it should return a movie", (done) =>
      {
         let movie = 
         {
            id: 1
         };

         chai.request(server)
         .post("/api/movie_return")
         .set("Authorization", `Bearer ${token}`)
         .send(movie)
         .end((err, res) =>
         {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("id");
            res.body.should.have.property("title");
            res.body.should.have.property("director");
            res.body.id.should.be.eql(1);
            res.body.title.should.be.eql("The Shawshank Redemption");
            res.body.director.should.be.eql("Frank Darabont");

            done();
         });
      });      
   });
});