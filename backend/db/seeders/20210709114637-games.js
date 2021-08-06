'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    // title: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    // },
    // description: {
    //   type: DataTypes.TEXT,
    //   allowNull: false,
    // },
    // remote: DataTypes.BOOLEAN,
    // public: DataTypes.BOOLEAN,
    // premium: DataTypes.BOOLEAN,
    // locationId: DataTypes.INTEGER,
    // gameSizeId: DataTypes.INTEGER,
    // gameTypeId: DataTypes.INTEGER,
    // gameTimeId: DataTypes.INTEGER,
    // gameFrequencyId: DataTypes.INTEGER,
    // //Figure this one out. Might need to be a joins table.
    // //blockedUsers: DataTypes.INTEGER,
    // homebrew: DataTypes.BOOLEAN,
    // houserules: DataTypes.BOOLEAN,
    // profanityOk: DataTypes.BOOLEAN,
    // gameCleanlinessId: DataTypes.INTEGER,
    // guestHostId: DataTypes.INTEGER,
    // hostId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
    // languageId: DataTypes.INTEGER,
    // ruleSetId: DataTypes.INTEGER

    await queryInterface.bulkInsert('Games', [{

      title: "Yet another adventure",
      description: "Exactly what it sounds like",
      blurb: "This is a blurb",
      remote: true,
      public: true,
      premium: false,
      locationId: 1,
      gameSizeId: 3,
      gameTypeId: 2,
      gameTimeId: 1,
      gameFrequencyId: 3,
      homebrew: true,
      houserules: true,
      profanityOk: true,
      gameCleanlinessId: 3,
      guestHostId: null,
      hostId: 1,
      languageId: 1,
      ruleSetId: 1
    },
    {

      title: "Grab your calculator",
      description: "Math is fun!",
      blurb: "This is another blurb",
      remote: true,
      public: true,
      premium: false,
      locationId: 1,
      gameSizeId: 3,
      gameTypeId: 2,
      gameTimeId: 1,
      gameFrequencyId: 3,
      homebrew: true,
      houserules: true,
      profanityOk: true,
      gameCleanlinessId: 3,
      guestHostId: null,
      hostId: 3,
      languageId: 1,
      ruleSetId: 1
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Games', null, {});
  }
};
