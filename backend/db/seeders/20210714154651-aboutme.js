'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('AboutMes', [{
      userId: 1,
      firstName: "Hana",
      pronouns: "she/her",
      bio: "I love this stuff",
      homebrew: true,
      houserules: true,
      profanity: true,
      },
      {
        userId: 2,
        firstName: "Scary",
        pronouns: "he/him",
        bio: "Long time player",
        homebrew: true,
        houserules: false,
        profanity: true,
        },
        {
          userId: 3,
          firstName: "Lucky Kitty Boy",
          pronouns: "he/him",
          bio: "meow",
          homebrew: true,
          houserules: true,
          profanity: false,
          },
          {
            userId: 4,
            firstName: "Groggy",
            pronouns: "he/him",
            bio: "I dislike novelty",
            homebrew: true,
            houserules: true,
            profanity: false,
            },
            {
              userId: 5,
              firstName: "CoffeeLikeMud",
              pronouns: "they/them",
              bio: "Just give me all the coffee...",
              homebrew: true,
              houserules: true,
              profanity: false,
              },
              {
                userId: 6,
                firstName: "Billy",
                pronouns: "he/him",
                bio: "I'm such a butthead.",
                homebrew: true,
                houserules: true,
                profanity: false,
                },
                {
                  userId: 7,
                  firstName: "Damien",
                  pronouns: "he/him",
                  bio: "Nothing but nihilism.",
                  homebrew: true,
                  houserules: true,
                  profanity: false,
                  },
                  {
                    userId: 8,
                    firstName: "Rouge",
                    pronouns: "she/her",
                    bio: "Just gonna steal everything not nailed down.",
                    homebrew: true,
                    houserules: true,
                    profanity: false,
                    },
                    {
                      userId: 9,
                      firstName: "Definitely not Mercedes Lackey",
                      pronouns: "she/her",
                      bio: "yep",
                      homebrew: true,
                      houserules: true,
                      profanity: false,
                      },
                      {
                        userId: 10,
                        firstName: "Hardy",
                        pronouns: "he/him",
                        bio: "I love math so much I do it for fun!",
                        homebrew: true,
                        houserules: true,
                        profanity: false,
                        }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('AboutMes', null, {});
  }
};
