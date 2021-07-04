let mongoose = require('mongoose');
const { compareSync, hashSync } = require('bcryptjs');

let AccountSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    username: {
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
        type: Array
    },
});

AccountSchema.methods.comparePasswords = function(password) {
    console.log('PASSWORD', password);
    return compareSync(password, this.hashedPassword);
}

const Account = mongoose.model('Account', AccountSchema);
module.exports = Account, AccountSchema;
