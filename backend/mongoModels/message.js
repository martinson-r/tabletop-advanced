let mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;
const Account = require('./account');
const Game = require('./game');
const mongoosePaginate = require('mongoose-paginate-v2');


let MessageSchema = mongoose.Schema({
    isMuted: Boolean,

    //if Message is part of a Game (gameId and isGame is true), it shows up as the game chat text.
    //if the Message has a gameId but isGame is false, it shows up as spectator chat.
    //if the Message has no gameId and isGame is false, it is a regular chat and displayed as such.
    isGame: Boolean,
    gameId: {
        type: ObjectId, ref: 'Game', index: true
    },
    //recipients must be filled with objectIds NOT set to a key in order for this to work.
    recipients: [{
            type: ObjectId, ref: 'Account', index: true
            }],
    messages: [{
        userId: {
            type: ObjectId, ref: 'Account', index: true
        },
        date: {
            type: Date,
            default: Date.now()
        },
        messageText: {
            type: String
        },
        messageType: {
            type: String
        },
        deleted: {
            type: Boolean
        },
        reported: {
            type: Boolean
        },
        reportedBy: {
            type: Array, userId: { type: ObjectId, ref: 'Account', index: true },
        }
    }],
});

MessageSchema.plugin(mongoosePaginate);

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message, MessageSchema;