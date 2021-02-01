const http = require('http');
const bodyParser = require('body-parser');

const cors = require('cors');

const express = require('express');
const mongoose = require('mongoose');

const port = process.env.PORT || 3001;
const username = process.env.User || 'jeyansaran620';
const password = process.env.Pass || 'jeyan@123';

const app = express();

app.use(cors());

app.use(bodyParser.json());

const url =  `mongodb+srv://${username}:${password}@cluster0.zmlzx.mongodb.net/<dbname>?retryWrites=true&w=majority`;

//const url = 'mongodb://localhost:27017/Tracker';


const connect = mongoose.connect(url,{
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true
  });

connect.then(() => {
    console.log('Connected correctly to server');
})
.catch((err) => console.log(err));


const Teams = require('./schemas/teams');

app.get('/teams/list', ((req,res,next) => {
  Teams.find({})
  .then((Teams) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(Teams);
  }, (err) => next(err))
  .catch((err) => next(err));
}));

app.post('/teams', ((req,res,next) =>  {
  Teams.create(req.body)
  .then((team) => {
      console.log('Team Created ', team);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(team);
  }, (err) => next(err))
  .catch((err) => next(err));
}));

app.get('*' ,(req,res) => {
  res.statusCode = 400;
  res.end("Bad Request path");
});

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server running at port ${port}/`);
});