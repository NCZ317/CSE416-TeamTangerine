
// const mongoose = require('mongoose')
// const dotenv = require('dotenv')
// dotenv.config();


// mongoose
//     .connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true})
//     .then(() => console.log("Database Connected Successfully"))
//     .catch(e => {
//         console.error('Connection error', e.message)
//     })

    
// const db = mongoose.connection

// module.exports = db





const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const isTestEnvironment = process.env.NODE_ENV === 'test';
let db;

if (isTestEnvironment) {
  const { MongoMemoryServer } = require('mongodb-memory-server');
  const mongoServer = new MongoMemoryServer();

  mongoServer.start().then(() => {
    const mongoUri = mongoServer.getUri();

    mongoose
      .connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log('In-Memory Database Connected Successfully'))
      .catch((e) => {
        console.error('In-Memory Database Connection error', e.message);
      });
  });

  db = mongoose.connection;
} else {
  mongoose
    .connect(process.env.DB_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('Real Database Connected Successfully'))
    .catch((e) => {
      console.error('Real Database Connection error', e.message);
    });

  db = mongoose.connection;
}

module.exports = db;
