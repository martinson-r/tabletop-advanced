let mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;
const Account = require('./account');
const Message = require('./message');

let GameSchema = mongoose.Schema({
    title: String,
    description: String,
    public: Boolean,
    premium: Boolean,
    remote: Boolean,
    language: { type: [{type: [String], enum: ['English', 'Spanish', 'French', 'German', 'Mandarin', 'Japanese','Korean'] }], default: ['English']},
    gameSize: {type: String, enum: ['Individual', '2-4 Players', '5-6 Players', '7+ Players']},
    ruleset: { brand: { type: String, enum: ['Dungeons and Dragons', 'Shadowrun', 'Pathfinder', 'Warhammer'] } },
    startTime: { type: String, trim: true },
    endTime: { type: String, trim: true },
    amPm: { type: String, enum: ["am", "pm"]},
    timeZone: { type: String, enum: ['GMT Greenwich Mean Time',
    'UTC Universal Coordinated Time',
    'ECT European Central Time',
    'EET Eastern European Time',
    'ART (Arabic) Egypt Standard Time',
    'EAT Eastern African Time',
    'MET Middle East Time',
    'NET Near East Time',
    'PLT Pakistan Lahore Time',
    'IST India Standard Time',
    'BST Bangladesh Standard Time',
    'VST Vietnam Standard Time',
    'CTT China Taiwan Time',
    'JST Japan Standard Time',
    'ACT Australia Central Time',
    'AET Australia Eastern Time',
    'SST Solomon Standard Time',
    'NST New Zealand Standard Time',
    'MIT Midway Islands Time',
    'HST Hawaii Standard Time',
    'AST Alaska Standard Time',
    'PST Pacific Standard Time',
    'PNT Phoenix Standard Time',
    'MST Mountain Standard Time',
    'CST Central Standard Time',
    'EST Eastern Standard Time',
    'IET Indiana Eastern Standard Time',
    'PRT Puerto Rico and US Virgin Islands Time',
    'CNT Canada Newfoundland Time',
    'AGT Argentina Standard Time',
    'BET Brazil Eastern Time',
    'CAT Central African Time']
    },
    gameDays: { type: [{type: [String], enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday'] }], default: ['Monday']},
    gameType: { type: [{type: [String], enum: ['Live Chat', 'Play by Post'] }], default: ['Live Chat']},
    gameFrequency: { type: [{type: [String], enum: ['Live Chat', 'Daily Posts', '3-4 Posts/week', '1-2 Posts/week'] }], default: ['Live Chat']},
    blockedUsers: { type: Array, userId: { type: ObjectId, ref: 'Account', index: true } },
    homebrew: Boolean,
    houserules: Boolean,
    profanityOk: Boolean,
    gameCleanliness: {
        type: Number, enum: [1, 2, 3, 4, 5]
    },
    host: { type: ObjectId, ref: 'User', index: true },
    guestHosts: { type: Array, userId: { type: ObjectId, ref: 'Account', index: true } },
    players: { type: Array, userId: { type: ObjectId, ref: 'Account', index: true } },
    waitlist: { type: Array, userId: { type: ObjectId, ref: 'Account', index: true } },
    spectators: { type: Array, userId: { type: ObjectId, ref: 'Account', index: true } },
    moderators: { type: Array, userId: { type: ObjectId, ref: 'Account', index: true } },
});

const Game = mongoose.model('Game', GameSchema);
module.exports = Game, GameSchema;
