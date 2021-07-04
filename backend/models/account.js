let mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;
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
        type: Array, userId: { type: ObjectId, ref: 'User', index: true },
    },
    emailVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    // conversations: {
    //     type: Array, messageId: { type: ObjectId, ref: 'Message', index: true },
    // },
    mutedPlayers: {
        type: Array, userId: { type: ObjectId, ref: 'User', index: true },
    },
    playedWith: {
        type: Array, userId: { type: ObjectId, ref: 'User', index: true },
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
        type: Array
    },
    rulesets: {
        type: Array
    },
    gameTimes: {
        type: Array
    },
    gameDays: {
        type: Array
    },
    gameTypes: { type: [{type: String, enum: ['Live Chat', 'Play by Post'] }], default: ['Live Chat']},
    gameFrequency: { type: [{type: String, enum: ['Live Chat', 'Daily Posts', '3-4 Posts/week', '1-2 Posts/week'] }], default: ['Live Chat']},
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
    console.log('PASSWORD', password);
    return compareSync(password, this.hashedPassword);
}

const Account = mongoose.model('Account', AccountSchema);
module.exports = Account, AccountSchema;
