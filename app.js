require('dotenv').config();
require('./src/config/app.config.js');
const mongoose = require('mongoose');

mongoose.connection.on("connected", () => {
    console.log(`Connected to database`);
    require('./src/server.js');
});


mongoose.connection.on("error", (err) => {
    console.error(`Failed to connect to database on startup `, err);
});

mongoose.connection.on("disconnected", () => {
    console.log(`Mongoose default connection to database disconnected`);
});


const exit = () => {
    mongoose.connection.close();
    mongoose.connection.on("close", () => {
        console.log(`Connection to database closed`);
        process.exit(0);
    });
};

process.on("SIGINT", exit).on("SIGTERM", exit).on("SIGQUIT", exit);

try {
    mongoose.connect(global.config.MONGODB_URI);
    console.log("Connecting to database...");
  } catch (err) {
    console.log("Sever initialization failed ", err.message);
  }
  