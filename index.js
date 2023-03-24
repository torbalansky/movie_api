const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');

app.use(express.static(path.join(__dirname, 'public')));

// use Morgan middleware to log all requests
app.use(morgan('tiny')); // Add this line to use morgan with the 'tiny' logging format

let topMovies = [
    { title: 'Blade Runner 2049', year: 2017 },
    { title: 'The Matrix', year: 1999 },
    { title: 'Inception', year: 2010 },
    { title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001 },
    { title: 'Star Wars: The Empire Strikes Back', year: 1980 },
    { title: 'The Terminator', year: 1984 },
    { title: 'Back to the Future', year: 1985 },
    { title: 'The Fifth Element', year: 1997 },
    { title: 'Avatar', year: 2009 },
    { title: 'Jurassic Park', year: 1993 }
  ];

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my movie API!');
});

app.get('/documentation', (req, res) => {                  
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

// error-handling middleware function
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
