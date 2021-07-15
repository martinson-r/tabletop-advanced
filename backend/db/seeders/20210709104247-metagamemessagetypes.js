'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     await queryInterface.bulkInsert('MetaGameMessageTypes', [{
      metaGameMessageType: "gmChat"
      },
      {
        metaGameMessageType: "diceroll"
      },
      {
        metaGameMessageType: "rollRequest"
      //reserved for GMs
      //GM can request dice rolls from players
      },
      {
      metaGameMessageType: "metagame"
      //ex: doing something out of character, outside of the realm of the game
      },
      {
        metaGameMessageType: "inCharacter"
      //ex: saying something as your character: "I'm going to run across the room"
      },
      {
        metaGameMessageType: "rpAction"
      //ex: performing an action as your character: Hana runs across the room
      },
      {
        metaGameMessageType: "event"
      //reserved for GMs
      //ex: The ground shakes beneath your feet
      },
      {
        metaGameMessageType: "initiative request"
      //reserved for GMs
      //request for players specifically to roll initiative (so it can be tracked)
      },
      {
        metaGameMessageType: "initiative roll"
      //players roll initiative. Marked so it can be tracked.
      },
      {
        metaGameMessageType: "system"
      //System message.
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('MetaGameMessageTypes', null, {});
  }
};
