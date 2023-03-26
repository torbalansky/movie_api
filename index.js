const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const uuid = require('uuid');
const bodyParser = require('body-parser');
const fs = require ('fs');
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' });
app.use(express.static(path.join(__dirname, 'public'))); // Sets up a static file server
app.use(morgan('tiny', { stream: accessLogStream })); // Add this line to use morgan with the 'tiny' logging format
app.use(bodyParser.json()); //Sets up body-parser middleware which is used to parse incoming request in JSON
app.use(bodyParser.urlencoded({ extended: true })); //Sets up body-parser middleware which is used to parse incoming request in URL

let movies = [
  {
    Title: "Star Wars",
    Description: "Star Wars (1977) is a classic science-fiction film that follows the story of a young farm boy named Luke Skywalker who joins forces with a Jedi Knight, a rogue pilot, and two droids to save the galaxy from the evil Empire, led by Darth Vader. Together, they embark on a thrilling adventure that includes epic space battles, lightsaber duels, and daring rescues. This film launched one of the most successful film franchises in history and is a must-see for sci-fi fans.",
    Genre: {
      Name: "Science Fiction",
      Description:
        "Science fiction is a film genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, interstellar travel, and other technologies.",
    },
    Director: {
      Name: "George Lucas",
      Bio:
        "George Walton Lucas Jr. is an American filmmaker. Lucas is best known for creating the Star Wars and Indiana Jones franchises and founding Lucasfilm, LucasArts, Industrial Light & Magic and THX.",
      BirthYear: "1944",
      DeathYear: "present",
    },
    ImageUrl: "https://images.app.goo.gl/npzmKEErmkW571eM7",
    Year: "1977",
    Featured: "yes",
  },
  {
    Title: "Blade Runner 2049",
    Description:
      "Blade Runner 2049 is a dystopian science-fiction film set thirty years after the events of the original Blade Runner movie. The story follows a new Blade Runner, LAPD Officer K, who uncovers a long-buried secret that has the potential to plunge what's left of society into chaos. As he sets out to find answers, K embarks on a dangerous mission that leads him to Rick Deckard, a former Blade Runner who has been missing for thirty years. Together, they must confront their own pasts and fight to save humanity's future. This visually stunning film, directed by Denis Villeneuve, is a worthy successor to the original and a must-see for fans of the genre.",
    Genre: {
      Name: "Science Fiction",
      Description:
        "Science fiction is a film genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, interstellar travel, and other technologies.",
    },
    Director: {
      Name: "Denis Villeneuve",
      Bio:
        "Denis Villeneuve is a Canadian film director, producer, and screenwriter. He is a four-time recipient of the Canadian Screen Award for Best Direction, for Maelström in 2001, Polytechnique in 2010, Incendies in 2011, and Enemy in 2013.",
      BirthYear: "1967",
      DeathYear: "present",
    },
    ImageUrl:
      "https://upload.wikimedia.org/wikipedia/en/8/8a/Blade_Runner_2049_poster.png",
    Year: "2017",
    Featured: "yes",
  },
  {
    Title: "The Matrix",
    Description:
      "The Matrix is a groundbreaking science-fiction film that tells the story of a computer programmer named Thomas Anderson, who discovers that the world he lives in is actually a simulated reality created by intelligent machines to keep humanity under control. With the help of a small band of rebels, led by the enigmatic Morpheus, Anderson learns to manipulate the simulated world and develops incredible powers as the prophesied One who can bring an end to the machines' rule. As Anderson, now known as Neo, fights to save humanity and unravel the mysteries of the Matrix, he must also confront his own doubts and fears. This visually stunning and thought-provoking film, directed by the Wachowski siblings, has become a classic of the science-fiction genre and has influenced countless films and pop culture references since its release.",
    Genre: {
      Name: "Science Fiction",
      Description:
        "Science fiction is a film genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, interstellar travel, and other technologies.",
    },
    Director: {
      Name: "The Wachowskis",
      Bio:
        "The Wachowskis are American film directors, screenwriters, and producers. They are best known for creating the Matrix franchise and are also known for their work on the films Bound, Speed Racer, and Jupiter Ascending.",
      BirthYear: "1965 (Lana), 1967 (Lilly)",
      DeathYear: "present",
    },
    ImageUrl:
      "https://upload.wikimedia.org/wikipedia/en/c/c1/The_Matrix_Poster.jpg",
    Year: "1999",
    Featured: "no",
  },
  {
    title: "Inception",
    description: "Inception is a mind-bending science-fiction film that explores the world of dreams and the power of the human mind. The story follows a skilled thief named Cobb, who is hired to perform a seemingly impossible task: to plant an idea in someone's mind through dream-sharing technology. As Cobb and his team delve deeper into the layers of dreams, they face unexpected challenges and dangers, including their own subconscious thoughts and memories. With stunning visuals and a complex plot that blurs the line between reality and dreams, Inception is a must-see film directed by Christopher Nolan that has become a modern classic of the sci-fi genre.",
    genre: {
      name: "science fiction",
      description: "Science fiction (or sci-fi) is a film genre that uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, dinosaurs, interstellar travel, time travel, or other technologies."
    },
    director: {
      name: "Christopher Nolan",
      bio: "Christopher Nolan is a British-American film director, writer, and producer. He is known for his mind-bending and visually stunning films such as Memento, The Dark Knight trilogy, and Inception.",
      birthyear: "1970",
      deathyear: "present"
    },
    imageurl: "https://images.app.goo.gl/pRNPJLfxE7VW85YX9",
    year: "2010",
    featured: "yes"
  },
  {
    title: "LOTR",
    description: "The Lord of the Rings: The Fellowship of the Ring is a epic fantasy film based on the classic novel by J.R.R. Tolkien. The story follows hobbit Frodo Baggins, who is entrusted with the dangerous task of destroying the One Ring, an ancient artifact of immense power that was forged by the Dark Lord Sauron to conquer and enslave all of Middle-earth. Along with a fellowship of other brave warriors, including humans, elves, and dwarves, Frodo embarks on a perilous journey to the heart of Sauron's realm, facing treacherous terrain, deadly enemies, and the corrupting influence of the Ring itself. With stunning visual effects, thrilling action sequences, and a cast of unforgettable characters, The Fellowship of the Ring is a masterpiece of fantasy filmmaking, directed by Peter Jackson, that captivates audiences with its immersive and engaging story.",
    genre: {
      name: "fantasy",
      description: "Fantasy is a film genre that uses magic and supernatural phenomena as a primary element of plot, theme, or setting. Fantasy films often have an element of adventure, and may include mythological creatures, elves, dwarves, and magic."
    },
    director: {
      name: "Peter Jackson",
      bio: "Peter Jackson is a New Zealand film director, producer, and screenwriter. He is best known for his adaptations of J.R.R. Tolkien's The Lord of the Rings and The Hobbit books, as well as his 2005 remake of King Kong.",
      birthyear: "1961",
      deathyear: "present"
    },
    imageurl: "https://images.app.goo.gl/VNTzQ1JgzGjKz7P38",
    year: "2001",
    featured: "yes"
  }  
];

let users = [
  {
    id: "1",
    name: "Patso",
    favoriteMovieList: [],
  },
  {
    id: "2",
    name: "Ivo",
    favoriteMovieList: ["Star Wars"],
  },
  {
    id: "3",
    name: "Hannibal",
    favoriteMovieList: [],
  },
];

// READ
app.get('/documentation', (req, res) => {
  console.log('Documentation Request');
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/', (req, res) => {
  console.log('Welcome to my movie database!');
  res.send('Welcome to my movie database!');
});

app.get('/movies', (req, res) => {
  res.status(200).json(movies);
  console.log('Movies request');
});

app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find((movie) => movie.Title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send('No such movie found');
  }
});

app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find((movie) => movie.Genre.Name === genreName)?.Genre;

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send('No such genre found');
  }
});

app.get('/movies/director/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = movies.find((movie) => movie.Director.Name === directorName)?.Director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send('No such director found');
  }
});

//CREATE
app.post('/users', (req,res) => {
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser)
    }
    else {
      res.status(400).send('new user not found')
    }
});

app.post('/users/:id/favorite-movies', (req,res)=>{
  const{id}=req.params;
  const{favoriteMovieTitle}=req.body;

  let user=users.find(user=>user.id == id);

  if(user){
      user.favoriteMovieList.push(favoriteMovieTitle);
      res.status(201).send('movie added to your favorites list');
      console.log(favoriteMovieTitle);
  }else{
      res.status(400).send('movie not added');
  }
});

//DELETE
app.delete('/users/:id/:favoriteMovieTitle', (req,res)=>{
  const {id, favoriteMovieTitle} =req.params;

  let user = users.find(user=>user.id ==id);

  if(user){ user.favoriteMovieList=user.favoriteMovieList.filter(title=>title !== favoriteMovieTitle);
      res.status(201).send('movie was deleted from your favorites');
  }else{
      res.status(400).send('movie was not deleted');
  }
});

app.delete('/users/:id', (req, res) => {
  const {id} = req.params;

  let user = users.find(user => user.id === id );

  if (user) {
    users = users.filter(user => user.id !== req.params.id);
    res.status(201).send('User account ' + req.params.id + ' was deleted.');
  }
});

// UPDATE
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const userUpdate = req.body;

  let user = users.find(user => user.id === id);

  if (user) {
    user.name = userUpdate.name;
    res.status(201).json(user);
  } else {
    res.status(400).send('Cannot update user.');
  }
});

app.put('/users/:id/:movie', (req, res) => {
  const { id, movie } = req.params;
  const user = users.find(user => user.id === id);

  if (user) {
    user.favoriteMovieList.push(movie);
    res.status(200).json(user);
  } else {
    res.status(404).send('User not found');
  }
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
