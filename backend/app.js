const express = require('express');
const { db, environment, port } = require('./config');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const session = require("express-session");
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const helmet = require('helmet');
const routes = require('./routes');
const { graphqlExpress, ApolloServer, makeExecutableSchema, gql } = require('apollo-server-express');
const resolvers = require('./graphql/resolvers');
const typeDefs = require('./graphql/typedefs');
const { sequelize } = require("./db/models");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const logger = require("morgan");

const { User, Game } = require('./db/models')

//asynchandler for errors
const asynchandler = require('express-async-handler');

//init App
const app = express();

// Security Middleware
    //test if we are in Production
    const isProduction = environment === 'production';
    //if not production, CORS okay.
if (!isProduction) {
    // enable cors only in development
    app.use(cors(
    ));
}

//Use cookie parser so we can parse cookies.
app.use(cookieParser());

//Add ability to use json
app.use(express.json());

//A little extra debugging help
app.use(logger("dev"));

//Just to be a bit safer.
// app.use(helmet({
//     contentSecurityPolicy: false
//   }));

// Set the _csrf token and create req.csrfToken method
// app.use(
//   csurf({
//     cookie: {
//       secure: isProduction,
//       sameSite: isProduction && 'lax',
//       httpOnly: true
//     }
//   })
// );

// set up session middleware


const server = new ApolloServer({
    typeDefs,
    resolvers,
    schema: makeExecutableSchema({
        typeDefs,
        resolvers
     }),
    subscriptions: {
        path: '/subscriptions'
      },
});
server.applyMiddleware({ app });

const store = new SequelizeStore({ db: sequelize });

//use sessions for tracking logins
app.use(session({
    name: 'tta.sid',
    secret: 'superSecret',
    resave: true,
    store: store,
    //Avoid race conditions & obey cookie related laws
    saveUninitialized: false
  }));

  //don't forget this part!
  store.sync();

app.use(routes); // Connect all the routes

// Error formatter
app.use((err, _req, res, _next) => {
    res.status(err.status || 500);
    console.error(err);
    res.json({
      title: err.title || 'Server Error',
      message: err.message,
      errors: err.errors,
      stack: isProduction ? null : err.stack
    });
  });

module.exports = app;
