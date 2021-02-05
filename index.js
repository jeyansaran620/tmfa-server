const http = require('http');
const bodyParser = require('body-parser');

const cors = require('cors');

const express = require('express');
const mongoose = require('mongoose');

const mailer = require("nodemailer");

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

app.get('/teams/:id', ((req,res,next) => {
  Teams.findById(req.params.id)
  .then((Team) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(Team);
  }, (err) => next(err))
  .catch((err) => next(err));
}));

let transport = mailer.createTransport({
  service: 'Gmail',
  auth: {
      user: "manavarmandramgct@gmail.com",
      pass: "TmFa@gct"
  }
});


app.post('/teams', ((req,res,next) =>  {
  Teams.create(req.body)
  .then((team) => {
      console.log('Team Created ', team);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');

      let mail = {
        from: "manavarmandramgct@gmail.com",
        to: team.TeamMembers[0].Email,
        subject: "Niralkalam Registration",
        text: `Dear ${team.TeamMembers[0].Name} Thank you for Registering to NiralKalam'21. Kindly mail us your Problem statement within March 1.`,
        html: `<body>
              <h3>Dear ${team.TeamMembers[0].Name}, Thank you for Registering to Niral Kalam.</h3>
              <h4>Kindly mail us your Problem statement within March 1.</h4>
              <b>All the Best ${team.TeamName}</b>
              <h2></h2>
              <h2>With Regards,</h2>
              <h2>Team Niralkalam'21</h2>
              <h2>Tamil Mandram and Fine Arts Club</h2>
              <h2>Government College of Technology, Coimbatore.</h2>
              </body>`
      }

      transport.sendMail(mail, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }
    
        smtpTransport.close();
    });

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