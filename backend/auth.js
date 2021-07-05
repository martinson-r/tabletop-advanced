const mongoose = require('mongoose');
//Import models
const Account = require('./models/account');

const loginUser = async (req, res, user, password) => {
    try {
        req.session.auth = {
            userId: user._id
        }
        console.log('SESSION', req.session);
      return user;
} catch (err) {
    console.log(err);
    res.status(401)
    res.send('Something went wrong.');
   }
}

const logoutUser = (req, res) => {
    delete req.session.auth;
  };

const restoreUser = async (req, res, next) => {
    // for debug
    if (req.session.auth) {
      const { userId } = req.session.auth;

      try {
        const user = await Account.findOne({_id: userId});

        if (user) {
          res.locals.authenticated = true;
          res.locals.user = user;
          next();
        }
      } catch (err) {
        res.locals.authenticated = false;
        next(err);
      }
    } else {
      res.locals.authenticated = false;
      next();
    }
};

module.exports = { loginUser, logoutUser, restoreUser };
