// THESE ARE NODE APIs WE WISH TO USE
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
const db = require('./db')
const cookieParser = require('cookie-parser')

// CREATE OUR SERVER
dotenv.config()
const PORT = process.env.PORT || 4000;
const app = express()

// SETUP THE MIDDLEWARE
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 'https://terratrove-df08dd7fc1f7.herokuapp.com' : 'http://localhost:3000',
    credentials: true
}))

// "https://terratrove-df08dd7fc1f7.herokuapp.com"
// http://localhost:3000

app.use(express.json())
app.use(cookieParser())

// SETUP OUR OWN ROUTERS AS MIDDLEWARE
const authRouter = require('./routes/auth-router')
app.use('/auth', authRouter)
const mapRouter  = require('./routes/map-router')
app.use('/api', mapRouter)


//CREATE BUILD FOR HEROKU TO DEPLOY
//COPY ALL DEPENDENCIES IN SERVER/PACKAGE.JSON TO THE PACKAGE.JSON FILE IN ROOT DIRECTORY
if (process.env.NODE_ENV === "production") {
    const buildPath = path.join(__dirname, "../client/build");

    app.use(express.static(buildPath));
    
    app.get(/^\/(?!api).*/, (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });

} else {
    app.get("/", (req, res) => {
        res.send("API running on localhost?");
    });
}

module.exports = app;

// Connect to MongoDB for error logging
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// PUT THE SERVER IN LISTENING MODE
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

