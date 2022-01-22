'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CharacterSheet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  CharacterSheet.init({
    name: DataTypes.STRING,
    age: DataTypes.INTEGER,
    intelligence: DataTypes.INTEGER,
    strength: DataTypes.INTEGER,
    wisdom: DataTypes.INTEGER,
    agility: DataTypes.INTEGER,
    dexterity: DataTypes.INTEGER,
    constitution: DataTypes.INTEGER,
    charisma: DataTypes.INTEGER,
    class: DataTypes.STRING,
    level: DataTypes.INTEGER,
    alignment: DataTypes.STRING,
    background: DataTypes.STRING,
    gender: DataTypes.STRING,
    armor: DataTypes.STRING,
    armorclass: DataTypes.INTEGER,
    initiative: DataTypes.STRING,
    speed: DataTypes.INTEGER,
    maxhp: DataTypes.INTEGER,
    currenthp: DataTypes.INTEGER,
    temphp: DataTypes.INTEGER,
    proficiencybonus: DataTypes.INTEGER,
    passiveperception: DataTypes.INTEGER,
    spellsweapons: DataTypes.STRING,
    spellatkbonus: DataTypes.INTEGER,
    spellsknown: DataTypes.STRING,
    preparedspells: DataTypes.STRING,
    spellsavedc: DataTypes.INTEGER,
    cantripsknown: DataTypes.STRING,
    slotlevel: DataTypes.INTEGER,
    traits: DataTypes.STRING,
    languages: DataTypes.STRING,
    proficiencies: DataTypes.STRING,
    weaponsspells: DataTypes.STRING,
    items: DataTypes.STRING,
    currency: DataTypes.STRING,
    notes: DataTypes.STRING,
    race: DataTypes.STRING,
    height: DataTypes.STRING,
    weight: DataTypes.STRING,
    streetcred: DataTypes.STRING,
    notoriety: DataTypes.STRING,
    publicawareness: DataTypes.STRING,
    karma: DataTypes.INTEGER,
    totalkarma: DataTypes.INTEGER,
    misc: DataTypes.STRING,
    body: DataTypes.INTEGER,
    reaction: DataTypes.INTEGER,
    logic: DataTypes.INTEGER,
    edge: DataTypes.INTEGER,
    edgepoints: DataTypes.INTEGER,
    essence: DataTypes.INTEGER,
    magicresonance: DataTypes.INTEGER,
    matrixinitiative: DataTypes.INTEGER,
    astralinitiative: DataTypes.INTEGER,
    composure: DataTypes.INTEGER,
    judgeintentions: DataTypes.INTEGER,
    memory: DataTypes.INTEGER,
    liftcarry: DataTypes.INTEGER,
    skills: DataTypes.STRING,
    primarylifestyle: DataTypes.STRING,
    licenses: DataTypes.STRING,
    fakeidsetc: DataTypes.STRING,
    contacts: DataTypes.STRING,
    qualities: DataTypes.STRING,
    augmentations: DataTypes.STRING,
    cyberdeck: DataTypes.STRING,
    vehicle: DataTypes.STRING,
    other: DataTypes.STRING,
    playerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CharacterSheet',
  });
  return CharacterSheet;
};
