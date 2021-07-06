let mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;
const Account = require('./account');
const Game = require('./game');

let MessageSchema = mongoose.Schema({
    isMuted: Boolean,
    isGame: Boolean,
    gameId: {
        type: Schema.Types.ObjectId, ref: 'Game', index: true
    },
    messages: [{
        userId: {
            type: Schema.Types.ObjectId, ref: 'Account', index: true
        },
        recipient: {
            type: Array, userId: { type: ObjectId, ref: 'Account', index: true },
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
    }]
});

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message, MessageSchema;
