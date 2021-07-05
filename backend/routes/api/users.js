const express = require('express');
const { check } = require('express-validator');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const { loginUser } = require('../../auth');
const bcrypt = require('bcryptjs');

//Import models
const Account = require('../../models/account');
var AccountSchema = require('mongoose').model('Account').schema

const router = express.Router();

router.post('/', asyncHandler(async(req, res, next) => {
    const {email, password} = req.body;

    if (email &&
        // userName &&
        password
        // && confirmPassword
    ){
        const hashedPassword = bcrypt.hashSync(password);

        var userData = {
          email,
        //   userName,
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



module.exports = router;
