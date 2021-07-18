const express = require('express');
const asyncHandler = require('express-async-handler');
const { loginUser, logoutUser, restoreUser } = require('../../auth');
const bcrypt = require('bcryptjs');
const csrf = require("csurf");
const { check, validationResult, body } = require("express-validator");

//Import models
const db = require("../../db/models");
const { User } = db;

const csrfProtection = csrf({ cookie: true });

//Split this into a utils file later
const handleValidationErrors = (req, res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      const errors = validationErrors.array().map((error) => error.msg);

      const err = Error("Bad request.");
      err.status = 400;
      err.title = "Bad request.";
      err.errors = errors;
      return next(err);
    }
    next();
  };

  //Just a boatload of validators
  const userValidators = [
    check("userName")
      .exists({ checkFalsy: true })
      .withMessage("Please provide a username")
      .isLength({ max: 50 })
      .withMessage("userName must not be longer than 50 characters"),
    check("email")
      .exists({ checkFalsy: true })
      .withMessage("Please provide an email")
      .isLength({ max: 255 })
      .withMessage("Email must not be longer than 255 characters")
      .isEmail()
      .withMessage("Please provide a valid email address")
      .custom((value) => {
        return db.User.findOne({ where: { email: value } }).then((user) => {
          if (user) {
            return Promise.reject(
              "The provided Email Address is already in use by another account"
            );
          }
        });
      }),
    check("password")
      .exists({ checkFalsy: true })
      .withMessage("Please provide a password")
      .isLength({ max: 50 })
      .withMessage("Password must not be longer than 50 characters")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, "g")
      .withMessage(
        'Password must contain at least 1 lowercase letter, uppercase letter, number, and special character (i.e. "!@#$%^&*")'
      ),
    check("confirmPassword")
      .exists({ checkFalsy: true })
      .withMessage("Please confirm your password")
      .isLength({ max: 50 })
      .withMessage("Password must not be longer than 50 characters")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Confirm Password does not match Password");
        }
        return true;
      }),
  ];

  const loginValidators = [
    check("userName")
      .exists({ checkFalsy: true })
      .withMessage("Please enter your user name."),
    check("password")
      .exists({ checkFalsy: true })
      .withMessage("Please enter your password."),
  ];


const router = express.Router();

  // Sign Up Users POST
  router.post(
    "/signup",
    // csrfProtection, <== add later
    userValidators,
    asyncHandler(async (req, res) => {
      const { userName, email, password, confirmPassword } = req.body;
      console.log(userName);
      const user = User.build({ userName, email });
      const validatorErrors = validationResult(req);
      console.log('ERRORS', validatorErrors)
      if (validatorErrors.isEmpty()) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.hashedPassword = hashedPassword;
        await user.save();

        //Log new user in.
        loginUser(req, res, user);

        //We really don't want to send more than this back.
        res.json({user: {userName: user.userName, email: user.email, id: user.id}});
      } else {
        console.log('hit errors')
        const errors = validatorErrors.array().map((error) => error.msg);
        res.json({errors})
    }
}));

  // POST login page.
  router.post(
    "/login",
    //csrfProtection,
    loginValidators,
    asyncHandler(async (req, res, next) => {
      const { userName, password } = req.body;
      const validatorErrors = validationResult(req);
      let errors = [];
      if (validatorErrors.isEmpty()) {
        const user = await User.findOne({ where: { userName } });
        if (user !== null) {
          const passwordMatch = await bcrypt.compare(
            password,
            user.hashedPassword.toString()
          );
          if (passwordMatch) {
            loginUser(req, res, user);
            res.json({user: {userName: user.userName, email: user.email, id: user.id}});
          }
        }
        errors.push("Username and password do not match.");
      } else {
        errors = validatorErrors.array().map((error) => error.msg);
        res.json({errors})
      }
    })
  );

  // Logout
  router.delete("/logout", (req, res) => {
    console.log(req)
    logoutUser(req, res);
    res.json({
      message: "Logout successful",
    });
  });

  //Restore session user
  router.get(
        '/',
        restoreUser,
        (req, res, next) => {
          const { user } = res.locals;
          console.log('user after restore', user)
          if (user) {
            return res.json({
              user: {userName: user.userName, email: user.email, id: user.id}
            });
          } else return res.json({message: 'no user found'});
        }
      );

module.exports = router;
