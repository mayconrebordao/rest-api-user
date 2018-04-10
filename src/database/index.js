const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/teste1-api");
mongoose.Promise = global.Promise;

module.exports = mongoose;

// const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/api4');
// mongoose.Promise = global.Promise;

// module.exports = mongoose;
