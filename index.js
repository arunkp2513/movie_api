const express = require('express');
const app = express();
morgan = require('morgan');
fs = require('fs');
path=require('path');
const accessLogStream = fs.createWriteStream(path.join(__dirname , 'log.txt'), {flags:'a'});
let topMovies = [{
    title: 'aaa'
  },
  {
    title: 'Lord of the Rings',
  },
  {
    title: 'Twilight',
  },
  {
    title: 'bbb',
  },
  {
    title: 'ccc',
  },
  {
    title: 'ddd',
  },
  {
    title: 'eee',
  },
];

app.use(morgan('combined', {stream: accessLogStream}));

app.get('/', (req, res) => {
  res.send('Welcome to myFlix app!');
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.use(express.static('public'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Error, please fix it!');
});


app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
