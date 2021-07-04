const express = require('express');
const { check } = require('express-validator');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Import models
const Account = require('../../models/account');
var AccountSchema = require('mongoose').model('Account').schema

const router = express.Router();

// router.get('/', asyncHandler(async(req, res) => {
//     //Get all accounts. Must be awaited.
//     const accounts = await Account.find({});

//     //Send back json of all accounts.
//     res.json({accounts});
// }));

router.post('/create', asyncHandler(async(req, res, next) => {
    const {email, username, password, confirmPassword} = req.body;

    if (email &&
        username &&
        password &&
        confirmPassword) {

        const hashedPassword = bcrypt.hashSync(password);

        var userData = {
          email,
          username,
          hashedPassword,
        }
        //use schema.create to insert data into the db
        try {
            Account.create(userData);
        }
         catch(err) {
            next(err)
          }
           res.redirect('/');
      }
}));

router.post('/login', asyncHandler(async(req, res, next) => {
try {
    const { email, password } = req.body;
    // await Joi.validate({ email, password }, signIn);
    const user = await Account.findOne({ email });
    if (user && user.comparePasswords(password)) {
      req.session.userId = user.id;
      console.log(user);
      res.send(user);
    } else {
      throw new Error('Invalid login credentials');
    }
  } catch (err) {
    res.status(401)
    res.send('Something went wrong.');
   }
}));

module.exports = router;
