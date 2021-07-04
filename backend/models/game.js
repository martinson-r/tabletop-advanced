let mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

let GameSchema = mongoose.Schema({

});

const Game = mongoose.model('Game', GameSchema);
module.exports = Game, GameSchema;
