const { gql } = require('apollo-server-express');
const Account = require('../models/account');

//type Account defines what you expect to get back from Query accounts:
const typeDefs = gql`
  type Query {
    accounts: [Account]
  }
  type Account {
    email: String,
    username: String,
    hashedPassword: String,
    blockedUsers: [Account]
  }
  type Mutation {
    blockAccount(emailToBlock: String, blockerEmail: String): Account
  }
`;

module.exports = typeDefs;
