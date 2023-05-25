const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Models = require('./models.js'),
  passportJWT = require('passport-jwt');

let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

/**
 * Passport local strategy for authenticating users.
 *
 * @param {string} username - The username field.
 * @param {string} password - The password field.
 * @param {function} callback - The callback function.
 * @returns {void}
 */

passport.use(new LocalStrategy({
  usernameField: 'Username',
  passwordField: 'Password'
}, (username, password, callback) => {
  console.log(username + '  ' + password);
  Users.findOne({ Username: username }, (error, user) => {
    if (error) {
      console.log(error);
      return callback(error);
    }

    if (!user) {
      console.log('incorrect username');
      return callback(null, false, {message: 'Incorrect username.'});
    }

    if (!user.validatePassword(password)) {
      console.log('incorrect password');
      return callback(null, false, {message: 'Incorrect password.'});
    }

    console.log('finished');
    return callback(null, user);
  });
}));

/**
 * Passport JWT strategy for authenticating users with JSON Web Tokens.
 *
 * @param {Object} jwtPayload - The JWT payload.
 * @param {function} callback - The callback function.
 * @returns {void}
 */

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your_jwt_secret'
}, (jwtPayload, callback) => {
  return Users.findById(jwtPayload._id)
    .then((user) => {
      return callback(null, user);
    })
    .catch((error) => {
      return callback(error)
    });
}));