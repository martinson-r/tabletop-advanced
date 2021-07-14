const { gql } = require('apollo-server-express');

const schema = gql`schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }`;

module.exports = schema
