const router = require('express').Router();
const sessionRouter = require('./session.js');
// const usersRouter = require('./users.js');
// const gamesRouter = require('./games.js');
// const messagesRouter = require('./messages.js');
const testRouter = require('./test.js');

//TODO: Auth

router.use('/session', sessionRouter);

//router.use('/users', usersRouter);

// router.use('/games', gamesRouter);

// router.use('/messages', messagesRouter);
router.use('/test', testRouter);

module.exports = router;
