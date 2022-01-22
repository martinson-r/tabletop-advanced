'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CharacterSheets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      age: {
        type: Sequelize.INTEGER
      },
      intelligence: {
        type: Sequelize.INTEGER
      },
      strength: {
        type: Sequelize.INTEGER
      },
      wisdom: {
        type: Sequelize.INTEGER
      },
      agility: {
        type: Sequelize.INTEGER
      },
      dexterity: {
        type: Sequelize.INTEGER
      },
      constitution: {
        type: Sequelize.INTEGER
      },
      charisma: {
        type: Sequelize.INTEGER
      },
      class: {
        type: Sequelize.STRING
      },
      level: {
        type: Sequelize.INTEGER
      },
      alignment: {
        type: Sequelize.STRING
      },
      background: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.STRING
      },
      armor: {
        type: Sequelize.STRING
      },
      armorclass: {
        type: Sequelize.INTEGER
      },
      initiative: {
        type: Sequelize.STRING
      },
      speed: {
        type: Sequelize.INTEGER
      },
      maxhp: {
        type: Sequelize.INTEGER
      },
      currenthp: {
        type: Sequelize.INTEGER
      },
      temphp: {
        type: Sequelize.INTEGER
      },
      proficiencybonus: {
        type: Sequelize.INTEGER
      },
      passiveperception: {
        type: Sequelize.INTEGER
      },
      spellsweapons: {
        type: Sequelize.STRING
      },
      spellatkbonus: {
        type: Sequelize.INTEGER
      },
      spellsknown: {
        type: Sequelize.STRING
      },
      preparedspells: {
        type: Sequelize.STRING
      },
      spellsavedc: {
        type: Sequelize.INTEGER
      },
      cantripsknown: {
        type: Sequelize.STRING
      },
      slotlevel: {
        type: Sequelize.INTEGER
      },
      traits: {
        type: Sequelize.STRING
      },
      languages: {
        type: Sequelize.STRING
      },
      proficiencies: {
        type: Sequelize.STRING
      },
      weaponsspells: {
        type: Sequelize.STRING
      },
      items: {
        type: Sequelize.STRING
      },
      currency: {
        type: Sequelize.STRING
      },
      notes: {
        type: Sequelize.STRING
      },
      race: {
        type: Sequelize.STRING
      },
      height: {
        type: Sequelize.STRING
      },
      weight: {
        type: Sequelize.STRING
      },
      streetcred: {
        type: Sequelize.STRING
      },
      notoriety: {
        type: Sequelize.STRING
      },
      publicawareness: {
        type: Sequelize.STRING
      },
      karma: {
        type: Sequelize.INTEGER
      },
      totalkarma: {
        type: Sequelize.INTEGER
      },
      misc: {
        type: Sequelize.STRING
      },
      body: {
        type: Sequelize.INTEGER
      },
      reaction: {
        type: Sequelize.INTEGER
      },
      logic: {
        type: Sequelize.INTEGER
      },
      edge: {
        type: Sequelize.INTEGER
      },
      edgepoints: {
        type: Sequelize.INTEGER
      },
      essence: {
        type: Sequelize.INTEGER
      },
      magicresonance: {
        type: Sequelize.INTEGER
      },
      matrixinitiative: {
        type: Sequelize.INTEGER
      },
      astralinitiative: {
        type: Sequelize.INTEGER
      },
      composure: {
        type: Sequelize.INTEGER
      },
      judgeintentions: {
        type: Sequelize.INTEGER
      },
      memory: {
        type: Sequelize.INTEGER
      },
      liftcarry: {
        type: Sequelize.INTEGER
      },
      skills: {
        type: Sequelize.STRING
      },
      primarylifestyle: {
        type: Sequelize.STRING
      },
      licenses: {
        type: Sequelize.STRING
      },
      fakeidsetc: {
        type: Sequelize.STRING
      },
      contacts: {
        type: Sequelize.STRING
      },
      qualities: {
        type: Sequelize.STRING
      },
      augmentations: {
        type: Sequelize.STRING
      },
      cyberdeck: {
        type: Sequelize.STRING
      },
      vehicle: {
        type: Sequelize.STRING
      },
      other: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('CharacterSheets');
  }
};