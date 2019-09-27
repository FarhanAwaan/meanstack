const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");

const config = require('./config/database');

// connection to mongoDB
mongoose.connect(config.database, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
// checking DB connection
mongoose.connection.on('connected', () => {
    console.log('MongoDB Connected');
});
// checking DB error
mongoose.connection.on('error', (err) => {
    console.log('Database Error: '+err);
});

// app initialization
const app = express();

const users = require('./routes/users');

// CORS middleware
app.use(cors());

// Set Stating Folder
app.use(express.static(path.join( __dirname + '/client')));

// Body Parser middleware
app.use(bodyParser.json());

// passport middleware
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

app.use('/users', users);

// Index Route
app.get('/', (req, res) => {
    res.send("Invalid Endpoint");
});

app.get('*', (req, res) => {
    res.sendFile(path.join( __dirname, 'public/index.html'));
});

// Port number
const port = process.env.PORT || 3000;

// Start Server
app.listen(port, () => {
    console.log(`Server started on ${port}`);
});