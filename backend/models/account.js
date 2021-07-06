let mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;
const Message = require('./message')
const { compareSync, hashSync } = require('bcryptjs');

let AccountSchema = mongoose.Schema({
    //Account Information
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    userName: {
        type: String,
        unique: true,
        required: true,
        trim: true
      },
    hashedPassword: {
        type: String,
        required: true
    },
    blockedUsers: {
        type: Array, userId: { type: ObjectId, ref: 'Account', index: true },
    },
    emailVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    conversations: {
        type: Array, messageId: { type: ObjectId, ref: 'Message', index: true },
    },
    mutedPlayers: {
        type: Array, userId: { type: ObjectId, ref: 'Account', index: true },
    },
    playedWith: {
        type: Array, userId: { type: ObjectId, ref: 'Account', index: true },
    },
    hideStrangers: {
        type: Boolean,
        default: true
    },

    //Community Information
    sportsmanship: {
        //sportsmanship tbd, will be enum
        type: Array
    },
    gamesHosted: {
        type: Number
    },
    gamesPlayed: {
        type: Number
    },
    reactionsReceived: {
        type: Number
    },
    reactionsGiven: {
        type: Number
    },
    sessionsPlayed: {
        type: Number
    },
    hostPoints: {
        type: Number
    },
    badges: {
        //badges tbd, will be enum
        type: Array
    },

    //About Me
    firstName: {
        type: String
    },
    pronouns: {
        type: Array
    },
    bio: {
        type: String
    },
    preferredLanguages: {
        type: Array
    },
    avatar: {
        type: String
    },
    profanity: {
        type: Boolean
    },

    //Game Preferences
    books: {
        //tbd enum
        type: Array
    },
    rulesets: {
        //tbd enum also embed books for each one
        type: Array
    },
    gameTimes: {
        //tbd enum
        type: Array
    },
    gameDays: { type: [{type: [String], enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday'] }], default: ['Monday']},
    gameTypes: { type: [{type: [String], enum: ['Live Chat', 'Play by Post'] }], default: ['Live Chat']},
    gameFrequency: { type: [{type: [String], enum: ['Live Chat', 'Daily Posts', '3-4 Posts/week', '1-2 Posts/week'] }], default: ['Live Chat']},
    homebrew: {
        type: Boolean
    },
    houserules: {
        type: Boolean
    },
    gameCleanliness: {
        type: Number
    },

    //Location Data
    postalCode: {
        type: String
    },
    stateOrProvince: {
        type: String
    },
    country: {
        type: String
    },
    timezone: {
        type: String
    }
});

AccountSchema.methods.comparePasswords = function(password) {
    return compareSync(password, this.hashedPassword);
}

const Account = mongoose.model('Account', AccountSchema);
module.exports = Account, AccountSchema;
