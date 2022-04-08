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
let users=[
  {
    id: 1,
    name: 'Arun',
    favoriteMovies: ['aaa']
  },
  {
    id : 2,
    name: 'Apoorva',
    favoriteMovies:['ccc']
  }
];
let movies=[
  {
    Title : 'aaa',
    Description: 'in the end it doesnt even matter',
    Genre: {
      Name : 'Drama',
      Description : 'narrative fiction'
    },
    Director:{
      Name:'Rajamouli'
    }
  },
  {
    Title : 'ccc',
    Description: 'in the end it doesnt even matter',
    Genre: {
      Name : 'Drama',
      Description : 'narrative fiction'
    },
    Director:{
      Name:'Dil Raju'
    }
  }
];
app.use(morgan('combined', {stream: accessLogStream}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Welcome to myFlix app!');
});

// CREATE - new user registration
app.post('/users', (req,res)=>{
  const newUser = req.body; // this is possible only because of the middleware body parser
  if (newUser.name){
    newUser.id = uuid.v4(); // assogns a unique ID for every new user
    users.push(newUser);
    res.status(201).json(newUser);
  }else{
    res.status(400).send('users need names');
  }
});

//UPDATE - update users info
app.put('/users/:id' , (req,res) =>{
  const{id} =req.params;
  const updatedUser = req.body;
  let user = users.find(user => user.id ==id ); // notice the two = sign used instead of three, as req.params gives a string and the id is an int

  if(user) {
    user.name=updatedUser.name;
    res.status(200).json(user);
  }
});

//POST
app.post('/users/:id/:movieTitle' , (req, res)=>{
  const {id,movieTitle} = req.params;
  let user = users.find(user =>user.id==id);
  if (user){
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(movieTitle +' has been added to ' +id+'s array');
  }else{
    res.status(400).send('no such user');
  }
});

//DELETE
app.delete('/users/:id/:movieTitle' , (req, res)=>{
  const {id,movieTitle} = req.params;
  let user = users.find(user =>user.id==id);
  if (user){
    user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
    res.status(200).send(movieTitle +' has been removed to ' +id+'s array');
  }else{
    res.status(400).send('no such user');
  }
});

//DELETE
app.delete('/users/:id' , (req, res)=>{
  const {id} = req.params;
  let user = users.find(user =>user.id==id);
  if (user){
    users= users.filter(user=> user.id != id);
    res.status(200).send('user  ' +id+' has been deleted');
  }else{
    res.status(400).send('no such user');
  }
});

// READ - This endpoint sends the complete list of movies
app.get('/movies', (req, res) => {
  res.status(200).json(movies)
});

//READ- Get movies by title
app.get('/movies/:title', (req,res)=>{
  const {title} = req.params; // object destructuring
  const movie = movies.find(movie => movie.Title === title);
  if (movie){
    res.status(200).json(movie);
  }else{
    res.status(400).send('no such movie');
  }
});

//READ - get movie genre and description
app.get('/movies/genre/:genreName', (req,res)=>{
  const {genreName} = req.params; // object destructuring
  const genre = movies.find(movie => movie.Genre.Name === genreName).Genre; //returns only the genre and not the entire object
  if (genre){
    res.status(200).json(genre);
  }else{
    res.status(400).send('no such genre');
  }
});

//READ - return data by director name
app.get('/movies/directors/:directorName', (req,res)=>{
  const {directorName} = req.params; // object destructuring
  const director= movies.find(movie => movie.Director.Name === directorName).Director; //returns only the genre and not the entire object
  if (director){
    res.status(200).json(director);
  }else{
    res.status(400).send('no such director');
  }
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
