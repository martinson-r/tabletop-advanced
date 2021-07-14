const express = require('express');
const asyncHandler = require('express-async-handler');
const { loginUser, logoutUser, restoreUser } = require('../../auth');
const bcrypt = require('bcryptjs');
const csrf = require("csurf");
const { check, validationResult, body } = require("express-validator");

//Import models
const db = require("../../db/models");
const { User } = db;
const { Message } = db;

const router = express.Router();

router.post("/newmsg", asyncHandler(async(req, res) => {

    const { gameId, userId, messageText } = req.body;


            console.log('SEND MSG ARGS', gameId, messageText, userId);
            const senderId = userId;
            const newMessage = await Message.create({gameId,messageText,senderId});
            const conversation = await Message.findAll({ where: { gameId: gameId }, include: [{model: User, as: "sender"}]});
            //pubsub.publish('NEW_MESSAGE', {messageSent: conversation});
            console.log('CONVERSATION', conversation)
            //return conversation;
            res.send(conversation)
}))

module.exports = router;
