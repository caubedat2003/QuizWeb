const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI);

const connection = mongoose.connection;

connection.on('connected', () => {
    console.log('MongoDb connected successfully');
});
connection.on('error', (err) => {
    console.log('MongoDb connection failed');
});
module.exports = connection;