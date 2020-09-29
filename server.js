const express = require('express');
const path = require('path');
const cors = require('cors');
const keys = require('./config/keys');

const app = express();

const corsOptions = {
    origin: "*",
    methods: ["GET", "POST"],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/covid19-tracker'));

app.get('/*', function(req,res) {
    res.sendFile(path.join(__dirname + '/dist/covid19-tracker/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(keys.port,  () => console.log(`app listening on port ${keys.port}!`));





