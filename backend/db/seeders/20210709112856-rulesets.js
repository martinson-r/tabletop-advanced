'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Rulesets', [{
     ruleset: "Dungeons & Dragons" },
     {
      ruleset: 'Pathfinder',
    },
    {
      ruleset: 'Shadowrun',
    },
    {
      ruleset: 'Blue Rose',
    },
    {
      ruleset: 'Warrior, Rogue & Mage',
    },
    {
      ruleset: 'Labyrinth Lord',
    },
    {
      ruleset: 'GURPS',
    },
    {
      ruleset: 'World of Darkness',
    },
    {
      ruleset: 'Vampire: The Masquerade',
    },
    {
      ruleset: 'd20 System (generic)',
    },
    {
      ruleset: 'Paranoia',
    },
    {
      ruleset: 'Fate',
    },
    {
      ruleset: 'Call of Cthulhu',
    },
    {
      ruleset: 'd20 Modern',
    },
    {
      ruleset: 'Exalted',
    },
    {
      ruleset: 'Lamentations of the Flame Princess',
    },
    {
      ruleset: 'Warhammer',
    },
    {
      ruleset: 'Big Eyes, Small Mouth',
    },
    {
      ruleset: 'Mutants & Masterminds',
    },
    {
      ruleset: 'TORG',
    },
    {
      ruleset: '7th Sea',
    },
    {
      ruleset: 'Dungeon World',
    },
    {
      ruleset: 'Champions/Hero',
    },
    {
      ruleset: 'Spirit of the Century',
    },
    {
      ruleset: 'All Flesh Must Be Eaten',
    },
    {
      ruleset: 'Changeling',
    },
    {
      ruleset: 'Frontier Space',
    },
    {
      ruleset: 'BattleTech',
    },
    {
      ruleset: 'Palladium',
    },
    {
      ruleset: 'Amber Diceless Roleplaying',
    },
    {
      ruleset: 'Marvel Heroic RPG',
    },
    {
      ruleset: 'FASERIP',
    },
    {
      ruleset: 'Freeform',
    },
    {
      ruleset: 'Miscellaneous/Other',
    },], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Rulesets', null, {});
  }
};
