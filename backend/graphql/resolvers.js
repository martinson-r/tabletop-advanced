const Account = require('../models/account');
// Provide resolver functions for your schema fields
const resolvers = {
    Query: {
        accounts: (obj, args, context, info) => {
            //This is where you actually query the database.
            return Account.find({});
          },
    },
    Mutation: {
        //Block accounts
        blockAccount: async(root, args) => {
            const accountToBlock = await Account.find({email: args.emailToBlock});

            //push email to be blocked into blockedUsers
            const blockAccount = { $push:
                { blockedUsers: accountToBlock },
             }

             //upsert: true means blockedUsers will be created if it doesn't exist
             const options = { upsert: true };

            const blocker = await Account.findOneAndUpdate({email: args.blockerEmail}, blockAccount, options);
            return blocker;
          },
        },
  };

  module.exports = resolvers;
