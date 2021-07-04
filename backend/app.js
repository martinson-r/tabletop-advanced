const express = require('express');
const mongoose = require('mongoose');
const { db, environment } = require('./config');
const { uri }  = db;
const bcrypt = require('bcryptjs');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const routes = require('./routes');
const session = require("express-session");
const MongoStore = require('connect-mongo');
const { graphqlExpress, ApolloServer, gql } = require('apollo-server-express');
const resolvers = require('./graphql/resolvers');
const typeDefs = require('./graphql/typedefs');

const Account = require('./models/account');
const Message = require('./models/message');

// Construct a schema, using GraphQL schema language

//Query for accounts: returns an array because it contains many things, so it must be placed
//inside of an array

//asynchandler for errors
const asynchandler = require('express-async-handler');

//init App
const app = express();

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });

//Use cookie parser so we can parse cookies.
app.use(cookieParser());

//Add ability to use json
app.use(express.json());

//Just to be a little safer.
app.use(helmet({
    contentSecurityPolicy: false
  }));

// Security Middleware
    //test if we are in Production
    const isProduction = environment === 'production';
    //if not production, CORS okay.
if (!isProduction) {
    // enable cors only in development
    app.use(cors());
  }

  //use sessions for tracking logins
app.use(session({
    name: 'tta.sid',
    secret: 'superSecret',
    resave: true,
    store: MongoStore.create( { mongoUrl: `${uri}` } ),
    //Avoid race conditions & obey cookie related laws
    saveUninitialized: false
  }));

app.use(routes); // Connect all the routes

app.get('/', asynchandler(async(req, res) => {
    //Get all accounts. Must be awaited.
    const accounts = await Account.find({});

    //Send back json of all accounts.
    res.json({accounts});
}));

// Catch unhandled requests and forward to error handler.
app.use((_req, _res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.title = 'Resource Not Found';
    err.errors = ["The requested resource couldn't be found."];
    err.status = 404;
    next(err);
  });

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
