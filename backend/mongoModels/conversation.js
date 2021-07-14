let mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;
const Account = require('./account');
const Message = require('./message');

let ConversationSchema = mongoose.Schema({

});

const Conversation = mongoose.model('Conversation', ConversationSchema);
module.exports = Conversation, ConversationSchema;
