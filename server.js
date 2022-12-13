// server.js
// where your node app starts

// init project
const express = require('express');
// const { Router } = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path')
const session = require('express-session')

app.use(express.static('views'))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  secret : 'secret',
  resave : true,
  saveUninitialized: false,
  cookie : {
    maxAge : 1000 * 60 * 30, // 30minrs
  },
}))


// Establish a connection with the Mongo Database
// Get the username, password, host, and databse from the .env file
const mongoDB = ("mongodb+srv://"+
                 process.env.USERNAME+
                 ":"
                 +process.env.PASSWORD+
                 "@"
                 +process.env.HOST+
                 "/"
                 +process.env.DATABASE);
mongoose.connect(mongoDB, {useNewUrlParser: true, retryWrites: true, useUnifiedTopology: true});

app.use(express.json({ limit: '20mb' }))

const router = require("./router");

router(app)

app.use((err, req, res, next) => {
  if (err) {
    res.status(err.code || 500).json({
      code: err.code || 500,
      msg: err.message || 'server error',
    })
  }
})




// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
