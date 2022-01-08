const express = require('express');
const { check } = require('express-validator');
const asyncHandler = require('express-async-handler');
const { loginUser } = require('../../auth');
const bcrypt = require('bcryptjs');
const { User, AboutMe } = require('/db/models');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

router.post('/', asyncHandler(async(req, res, next) => {
    const {email, userName, password, confirmPassword } = req.body;

    if (email &&
        userName &&
        password
    ){
        const hashedPassword = bcrypt.hashSync(password);

        try {
            const newUser = User.create({ email, userName, hashedPassword });
            const userId = newUser.id

            //They also need a bio, even if there's nothing in it.
            AboutMe.create({userId});
        }
         catch(err) {
            next(err)
          }
           res.redirect('/');
      }
}));



module.exports = router;
