/**
 * Module dependencies.
 */

const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const uuid = require('uuid');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Models = require('./models');
const Movies = Models.Movie;
const Users = Models.User;
const { check, validationResult } = require("express-validator"); // Requiring express-validator for server side input protection against hacker attacks

/**
 * Sets up a static file server.
 */

app.use(express.static(path.join(__dirname, 'public'))); // Sets up a static file server

// Route that logs a message
app.get('/example', (req, res) => {
  console.log('This is a log message.');
  res.send('Response from the server.');
});

/**
 * Sets up body-parser middleware for parsing JSON requests.
 */

app.use(bodyParser.json()); //Sets up body-parser middleware which is used to parse incoming request in JSON
app.use(bodyParser.urlencoded({ extended: true })); //Sets up body-parser middleware which is used to parse incoming request in URL

/**
 * Connects to the MongoDB database.
 */
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('strictQuery', false);
//mongoose.connect('mongodb://127.0.0.1:27017/cfDB', { useNewUrlParser: true, useUnifiedTopology: true });
/**
 * Defines the allowed origins for CORS.
 */

const cors = require('cors');

app.use(cors());

// Set up additional headers to allow cross-origin requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Replace '*' with the specific origin of your React application if needed
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

/**
 * Sets up authentication middleware.
 */

let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');

  
// READ
/**
 * GET / - Welcome message.
 * * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

app.get('/', (req, res) => {
  res.send('Welcome to my movie API!');
  });

// Get all movies
/**
 * GET /movies - Get all movies.
 * * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});   

// Get a movie by title
/**
 * GET /movies/title/:Title - Get a movie by title.
 * * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

app.get('/movies/title/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
 

// Get a genre by name
/**
 * GET /movies/genre/:genreName - Get a genre by name.
 * * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.genreName })
    .then((movie) => {
      res.json(movie.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a director by name
/**
 * GET /movies/directors/:directorName - Get a director by name.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

app.get('/movies/directors/:directorName', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.directorName })
    .then((movie) => {
      res.json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
}); 

// Get all users
/**
 * GET /users - Get all users.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username
/**
 * GET /users/:username - Get a user by username.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

app.get('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//CREATE
// Create a new user
/**
 * POST /users - Create a new user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

app.post('/users', 

[
  check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
],

(req, res) => {

// check the validation object for errors
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
    .then((user) => {
      if (user) {
        //If the user is found, send a response that it already exists
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) => { res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

//Update user
/**
 * Update user
 *
 * @param {string} "/users/:Username" - The route to update a user.
 * @param {Function[]} Middleware - An array of middleware functions for input validation.
 * @param {Function} Passport authentication middleware.
 * @param {Function} Request handler function.
 */

app.put(
  "/users/:Username",
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    const promise = Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Name: req.body.Name,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }
    ) // This line makes sure that the updated document is returned
      .exec();

    promise.then((updatedUser) => {
      res.json(updatedUser);
    });
  }
);

// Add a movie to the user's favorite list
/**
 * Add a movie to the user's favorite list
 *
 * @param {string} "/users/:Username/movies/:MovieID" - The route to add a movie to the user's favorite list.
 * @param {Function} Passport authentication middleware.
 * @param {Function} Request handler function.
 */

app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        return res.status(404).send('User not found');
      }
      Movies.findOne({ _id: req.params.MovieID })
        .then((movie) => {
          if (!movie) {
            return res.status(404).send('Movie not found');
          }
          Users.findOneAndUpdate({ Username: req.params.Username }, {
            $addToSet: { FavoriteMovies: req.params.MovieID }
          },
          { new: true }, 
          (err, updatedUser) => {
            if (err) {
              console.error(err);
              res.status(500).send('Error: ' + err);
            } else {
              res.json(updatedUser);
            }
          });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


//Remove a title from user's favorite list
/**
 * Remove a title from the user's favorite list
 *
 * @param {string} "/users/:Username/movies/:MovieID" - The route to remove a title from the user's favorite list.
 * @param {Function} Passport authentication middleware.
 * @param {Function} Request handler function.
 */

app.put('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { Username } = req.params;
  const MovieID = [req.params.MovieID]; // Wrap the ID in an array

  Users.findOne({ Username })
    .then((user) => {
      if (!user) {
        return res.status(404).send('User not found');
      }
      Movies.findOne({ _id: req.params.MovieID })
        .then((movie) => {
          if (!movie) {
            return res.status(404).send('Movie not found');
          }
          Users.findOneAndUpdate(
            { Username },
            { $pullAll: { FavoriteMovies: MovieID } },
            { new: true }
          )
            .then((updatedUser) => {
              res.json(updatedUser);
            })
            .catch((err) => {
              console.error(err);
              res.status(500).send('Error: ' + err);
            });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//DELETE
// delete a movie to a user's list of favorites
/**
 * Delete a movie from a user's list of favorites
 *
 * @param {string} "/users/:Username/movies/:MovieID" - The route to delete a movie from a user's list of favorites.
 * @param {Function} Passport authentication middleware.
 * @param {Function} Request handler function.
 */

app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $pull: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, 
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Delete a user by username
/**
 * Delete a user by username
 *
 * @param {string} "/users/:Username" - The route to delete a user by username.
 * @param {Function} Passport authentication middleware.
 * @param {Function} Request handler function.
 */

app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
/**
 * Get the documentation page.
 *
 * @param {string} "/documentation" - The route to get the documentation page.
 * @param {Function} Request handler function.
 */
app.get('/documentation', (req, res) => {                  
  res.sendFile('public/documentation.html', { root: __dirname });
  });

// error-handling middleware function
/**
 * Error handling middleware function.
 *
 * @param {Error} err - The error object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next function.
 */

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});
