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
        // required: true,
        trim: true
      },
    hashedPassword: {
        type: String,
        required: true
    },
    blockedUsers: [{userId: { type: ObjectId, ref: 'Account', index: true }}],
    emailVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    mutedPlayers: [{userId: { type: ObjectId, ref: 'Account', index: true }}],
    playedWith: [{userId: { type: ObjectId, ref: 'Account', index: true }}],
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
        type: [Number], enum: [1, 2, 3, 4, 5]
    },

    //Location Data
    postalCode: {
        type: String
    },
    stateOrProvince: {
        type: String, enum: [
            'Alabama',
            'Alaska',
            'Arizona',
            'Arkansas',
            'California',
            'Colorado',
            'Connecticut',
            'Delaware',
            'Florida',
            'Georgia',
            'Hawaii',
            'Idaho',
            'Illinois',
            'Indiana',
            'Iowa',
            'Kansas',
            'Kentucky',
            'Louisiana',
            'Maine',
            'Maryland',
            'Massachusetts',
            'Michigan',
            'Minnesota',
            'Mississippi',
            'Missouri',
            'MontanaNebraska',
            'Nevada',
            'New Hampshire',
            'New Jersey',
            'New Mexico',
            'New York',
            'North Carolina',
            'North Dakota',
            'Ohio',
            'Oklahoma',
            'Oregon',
            'PennsylvaniaRhode Island',
            'South Carolina',
            'South Dakota',
            'Tennessee',
            'Texas',
            'Utah',
            'Vermont',
            'Virginia',
            'Washington',
            'West Virginia',
            'Wisconsin',
            'Wyoming',
            'Alberta',
            'British Columbia',
            'Manitoba',
            'New Brunswick',
            'Newfoundland and Labrador',
            'Northwest Territories',
            'Nova Scotia',
            'Nunavut',
            'Ontario',
            'Prince Edward Island',
            'Quebec',
            'Saskatchewan',
            'Yukon',
            ]
    },
    country: {
        type: String, enum: ['North America', 'Central America', 'Europe', 'Asia', 'Africa', 'Central America', 'South America', 'Pacific Islands', 'Australia', 'Other']
    },
    timezone: {
        type: String, enum: ['GMT Greenwich Mean Time',
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
    }
});

AccountSchema.methods.comparePasswords = function(password) {
    return compareSync(password, this.hashedPassword);
}

const Account = mongoose.model('Account', AccountSchema);
module.exports = Account, AccountSchema;
