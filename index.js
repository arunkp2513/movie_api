const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;
mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });
const express = require('express');
const app = express();
morgan = require('morgan');
fs = require('fs');
path = require('path');
bodyParser = require('body-parser');
uuid = require('uuid');
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
  flags: 'a'
});

app.use(morgan('combined', {stream: accessLogStream}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Welcome to myFlix app!');
});

//Return all the movie
app.get('/movies', (req,res) =>{
  Movies.find()
  .then((movies) =>{
    res.status(201).json(movies);
  })
  .catch((err) =>{
    console.error(err);
    res.status(500).send('Error : ' + err);
  });
});

//GET all users
app.get('/users' , (req,res)=>{
  Users.find()
  .then((users) => {
    res.status(201).json(users);
  })
  .catch((err) =>{
    console.error(err);
    res.status.send('Error: ' + err);
  });
});

// CREATE - new user registration
app.post('/users', (req,res)=>{
  //checking if the user already exists
  Users.findOne({Username:  req.body.Username})
  .then((user)=>{
    if(user){
      return res.status(400).send(req.body.Username = + 'already exists');
    }else{
      Users.create({
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      })
      .then((user)=>{res.status(201).json(user)})
      .catch((err)=>{
        console.error(err);
        res.status(500).send('Error: ' +err);
      });
    }
  })
  .catch((err)=>{
    console.error(err);
    res.status(500).send('Error: ' +err);
  });
});

// Get a user by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//UPDATE a user's info by Username
app.put('/users/:Username', (res,req) =>{
  Users.findOne({ Username: req.params.Username},{ $set:
    {
      Username : req.body.Username,
      Password : req.body.Password,
      Email : req.body.Email,
      Birthday : req.body.Birthday
    }
  },
  { new : true} , // This makes sure that the updated document is returned
  (error , UpdatedUser) => {
    if(error) {
      console.error(err);
      res.status(500).send ('Error ; ' + err);
    } else{
      res.json(updatedUser);
    }
  });
});

//add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//remove a movie from a user's list of favourites
app.delete('/users/:Username/movies/:MovieID' , (req, res)=>{
  Users.findOneAndUpdate ({ Username: req.params.Username},{
    $pull : { FavoriteMovies : req.params.MovieID}
  },
  {new : true},
  (error, updatedUser) =>{
    if(error) {
      console.error(err);
      res.status(500).send('Error: ' +err);
    } else{
      res.json(updatedUser);
    }
  });
});

//DELETE a user by userName
app.delete('/users/:Username' , (req, res)=>{
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

//READ- Get movies by title
app.get('/movies/:title', (req,res)=>{
  Movies.findOne({title : req.params.title})
   .then((movie) =>{
     res.json(movie);
   })
    .catch((err) =>{
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

// GET genre information
app.get('/genre/:Name', (res,req) =>{
  Genres.findOne({Name:req.params.Name})
  .then((genre) =>{
    res.json(genre.Description);
  })
  .catch((err) =>{
    console.error(err);
    res.statis(500).sen('Error: ' +err);
  });
});

//READ - get movie genre and description
//app.get('/movies/genre/:genreName', (req,res)=>{


//READ - return data by director name
app.get('/movies/directors/:directorName', (req,res)=>{
  Directors.findOne({ Name: req.params.Name})
  .then((director) =>{
    res.json(director);
  })
  .catch((err) =>{
    console.error(err);
    res.status(500).send('Error: ' +err);
  });
});

app.use((err, req, res, next) => {
 console.error(err.stack);
 res.status(500).send('Something broke!');
});


app.listen(8080, () =>{
 console.log('Your app is listening on port 8080.');
});
