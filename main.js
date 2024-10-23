const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const DB_NAME = require("./constants")
const dotenv = require("dotenv")
dotenv.config() // loading files

// require('dotenv').config(); // For loading environment variables
const app = express();


// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Importing Routes
const routes = require("./routes/router");

// MongoDB connection
mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex:true,
    // useFindAndModify: false
})
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((error) => {
    console.error("Error connecting to MongoDB:", error); // More detailed error logging
});

// Using the routes
app.use('/api/user', routes);

// Starting the server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT}`);
});
