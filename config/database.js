const Sequelize = require("sequelize");

/* 
 * Usado para que a mensagem do validation "notNull" funcione juntamente com
 * "allowNull" sem causar problemas 
 */
Sequelize.Validator.notNull = function (item)
{
   return !this.isNull(item);
};

/* 
 * Se não for definido "host" na criação do objeto Sequelize irá usar o host default
 * que é "localhost"
 */
const connectionHost = "localhost";
/* 
 * Se não for definido "port" dentro do objeto Sequelize irá usar a porta default
 * do dialect definido no objeto Sequelize, no caso do mysql a porta default é "3306"
 */
const connectionPort = 3306;
const databseName = "movierentaldb";
const userName = "teste";
const password = "teste";

const Op = Sequelize.Op;
const operatorsAliases =
{
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $not: Op.not,
  $in: Op.in,
  $notIn: Op.notIn,
  $is: Op.is,
  $like: Op.like,
  $notLike: Op.notLike,
  $iLike: Op.iLike,
  $notILike: Op.notILike,
  $regexp: Op.regexp,
  $notRegexp: Op.notRegexp,
  $iRegexp: Op.iRegexp,
  $notIRegexp: Op.notIRegexp,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $overlap: Op.overlap,
  $contains: Op.contains,
  $contained: Op.contained,
  $adjacent: Op.adjacent,
  $strictLeft: Op.strictLeft,
  $strictRight: Op.strictRight,
  $noExtendRight: Op.noExtendRight,
  $noExtendLeft: Op.noExtendLeft,
  $and: Op.and,
  $or: Op.or,
  $any: Op.any,
  $all: Op.all,
  $values: Op.values,
  $col: Op.col
};

const sequelize = new Sequelize(databseName, userName, password, 
{
   dialect: "mysql",
   host: connectionHost,
   port: connectionPort,
   operatorsAliases,
   logging: false //não mostra as consultas no terminal
});

const toExport = {};

toExport.Sequelize = Sequelize;
toExport.sequelize = sequelize;

/* Tabelas do banco de dados */
toExport.User = require("../api/models/user")(sequelize, Sequelize);
toExport.Movie = require("../api/models/movie")(sequelize, Sequelize);
toExport.MovieRental = require("../api/models/movie_rental")(sequelize, Sequelize);
toExport.UserRentedMovie = require("../api/models/user_rented_movie")(sequelize, Sequelize);

/* Relações entre as tabelas */
toExport.UserRentedMovie.belongsTo(toExport.User, {foreignKey: "user_id"});
toExport.UserRentedMovie.belongsTo(toExport.Movie, {foreignKey: "movie_id"});

toExport.Movie.hasMany(toExport.UserRentedMovie, {foreignKey: "movie_id"});

/* 
 * Aqui "MovieRental" é o source e "Movie" é o target.
 * 
 * "hasMany" define uma associação de um source para multiplos targets(relação 1:n do MySQL). 
 * O atributo "foreignKey" adiciona a chave estrangeira "movie_rental_id"
 * na tabela "Movie".
 * Instancias de "MovieRental" terão os accessors "getMovies" e "setMovies"
 */
toExport.MovieRental.hasMany(toExport.Movie, 
{ 
   foreignKey: "movie_rental_id",
   onDelete: "CASCADE"
});

module.exports = toExport;