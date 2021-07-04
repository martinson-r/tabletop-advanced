let mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;
const Account = require('./account');

let MessageSchema = mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId, ref: 'Account', index: true
    },
    recipient: {
        type: Array
    },
    date: {
        type: Date,
        default: Date.now()
    },
    messageText: {
        type: Array
    },
    messageType: {
        type: Array
    },
    deleted: {
        type: Boolean
    },
    reported: {
        type: Boolean
    },
    reportedBy: {
        type: Array
    }


});

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message, MessageSchema;
