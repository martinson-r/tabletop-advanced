const express = require('express');
const { check } = require('express-validator');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const { loginUser, logoutUser, restoreUser } = require('../../auth');
const bcrypt = require('bcryptjs');

//Import models
const Account = require('../../models/account');
var AccountSchema = require('mongoose').model('Account').schema

const router = express.Router();

router.post('/', asyncHandler(async(req, res, next) => {
    console.log('hit session login router')
    try {
        const { email, password } = req.body;
        console.log('EMAIL', email)
        if (email && password) {
            const foundUser = await Account.findOne({ email });

            try {
                if (foundUser && foundUser.comparePasswords(password)) {
                    const user = await loginUser(req, res, foundUser);
                    res.json({user})
                }
            } catch(e) {
                    console.log(e);
                }
        } else {
            res.json('invalid credentials')
        }
        // await Joi.validate({ email, password }, signIn);
    } catch(e) {
        console.error(e);
    }
}));

router.delete('/', (req, res, next) => {
    logoutUser(req, res);
    return res.json({ message: 'success' });
});

// Restore session user
router.get(
    '/',
    restoreUser,
    (req, res) => {
      const { user } = req;
      if (user) {
        return res.json({
          user
        });
      } else return res.json({});
    }
  );

module.exports = router;
