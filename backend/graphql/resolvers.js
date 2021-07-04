const Account = require('../models/account');
let mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;
// Provide resolver functions for your schema fields
const resolvers = {
    Query: {
        accounts: (obj, args, context, info) => {
            //This is where you actually query the database.
            return Account.find({})
            .populate('blockedUsers');
          },
    },
    Mutation: {
        //Block accounts
        blockAccount: async(root, args) => {
            const accountToBlock = await Account.findOne({email: args.emailToBlock});
            console.log('email', accountToBlock.email);

            //push id of user to be blocked into blockedUsers
            const blockAccount = { $push:
                { blockedUsers: accountToBlock._id },
             }

             //upsert: true means blockedUsers will be created if it doesn't exist
             const options = { upsert: true };

            const blocker = await Account.findOneAndUpdate({email: args.blockerEmail}, blockAccount, options);
            return blocker;
          },
        },
  };

  module.exports = resolvers;
