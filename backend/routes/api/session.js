const express = require('express');
const asyncHandler = require('express-async-handler');
const { loginUser, logoutUser, restoreUser } = require('../../auth');
const bcrypt = require('bcryptjs');
const csrf = require("csurf");
const { check, validationResult, body } = require("express-validator");

//Import models
const db = require("../../db/models");
const { User, AboutMe } = db;

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
      .isLength({ min: 3 })
      .withMessage("User name must be at least 3 characters long")
      .isLength({ max: 50 })
      .withMessage("User name must not be longer than 50 characters")
      .matches(/^[A-Za-z0-9]+[\-_]?[A-Za-z0-9]+$/)
      .withMessage('User name must contain only letters, numbers, underscores, or dashes, and must start and end with a letter or number.')
      .custom((value) => {
        return db.User.findOne({ where: { userName: value } }).then((user) => {
          if (user) {
            return Promise.reject(
              "The provided Username is already in use by another account"
            );
          }
        })
      }),
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
        })
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
      .withMessage("Please enter your user name.")
      .custom((value) => {
        return db.User.findOne({ where: { userName: value } }).then((user) => {
          if (!user) {
            return Promise.reject(
              "User not found."
            );
          }
        })
      }),
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
      const user = User.build({ userName, email });
      const validatorErrors = validationResult(req);
      if (validatorErrors.isEmpty()) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.hashedPassword = hashedPassword;
        await user.save();

        //Create an 'empty' bio with some prefilled booleans for houserules etc
        await AboutMe.create({userId: user.id});
        //Log new user in.
        loginUser(req, res, user);

        //We really don't want to send more than this back.
        res.json({user: {userName: user.userName, email: user.email, id: user.id}});
      } else {
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
          } else {
            errors.push("Invalid credentials. Please double check user name and password and try again.");
            res.json({errors})
          }
        }
      } else {
        errors = validatorErrors.array().map((error) => error.msg);
        res.json({errors})
      }
    })
  );

  // Logout
  router.delete("/logout", (req, res) => {
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
          if (user) {
            return res.json({
              user: {userName: user.userName, email: user.email, id: user.id}
            });
          } else return res.json({message: 'no user found'});
        }
      );

module.exports = router;
