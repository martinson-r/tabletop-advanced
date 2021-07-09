const router = require('express').Router();
const sessionRouter = require('./session.js');
// const usersRouter = require('./users.js');
// const gamesRouter = require('./games.js');
// const messagesRouter = require('./messages.js');

//TODO: Auth

router.use('/session', sessionRouter);

//router.use('/users', usersRouter);

// router.use('/games', gamesRouter);

// router.use('/messages', messagesRouter);

module.exports = router;
