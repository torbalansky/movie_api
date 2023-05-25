const { default: mongoose } = require("mongoose");
const bcrypt = require('bcrypt');

/**
 * Mongoose schema for movies.
 *
 * @typedef {Object} MovieSchema
 * @property {string} Title - The title of the movie.
 * @property {string} Description - The description of the movie.
 * @property {Object} Genre - The genre information of the movie.
 * @property {string} Genre.Name - The name of the genre.
 * @property {string} Genre.Description - The description of the genre.
 * @property {Object} Director - The director information of the movie.
 * @property {string} Director.Name - The name of the director.
 * @property {string} Director.Bio - The biography of the director.
 * @property {string[]} Actors - The list of actors in the movie.
 * @property {string} ImagePath - The path to the image of the movie.
 * @property {boolean} Feautured - Indicates if the movie is featured.
 */

/**
 * Mongoose schema for users.
 *
 * @typedef {Object} UserSchema
 * @property {string} Username - The username of the user.
 * @property {string} Password - The password of the user.
 * @property {string} Email - The email address of the user.
 * @property {Date} Birthday - The birthday of the user.
 * @property {Object[]} FavoriteMovies - The list of favorite movies of the user.
 * @property {mongoose.Types.ObjectId} FavoriteMovies._id - The ID of the favorite movie.
 */

let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Bio: String
    },
    Actors: [String],
    ImagePath: String,
    Feautured: Boolean
});

let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

/**
 * Hashes the given password using bcrypt.
 *
 * @param {string} password - The password to hash.
 * @returns {string} The hashed password.
 */

userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
  };

  /**
 * Validates the given password against the user's hashed password.
 *
 * @param {string} password - The password to validate.
 * @returns {boolean} True if the password is valid, false otherwise.
 */

  userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
  };

/**
 * Mongoose model for movies.
 *
 * @typedef {Model<MovieSchema>} MovieModel
 */

/**
 * Mongoose model for users.
 *
 * @typedef {Model<UserSchema>} UserModel
 */

// creation of models
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;