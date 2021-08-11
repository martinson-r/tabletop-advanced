const { environment, port } = require('../config');
const isProduction = process.env.NODE_ENV === "production";

let io = require('socket.io')()

if (!isProduction) {
  io = require('socket.io')({cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }});
}

let connectedUsers = {};

io.on('connection', function (socket) {

  socket.on('send-chat-message', function (data) {


    //This all needs to be reworked. Old code for reference.

    // let jsonMessageData = JSON.parse(data);
    // const jsonRecipient = jsonMessageData.data.Recipient.id;
    // const jsonUser = jsonMessageData.data.User.id;
    // let recipientId = connectedUsers[jsonRecipient];
    // let senderId = connectedUsers[jsonUser];
    // io.to(senderId).emit('broadcast-chat-message', data);
    // if (recipientId !== undefined) {
    //   io.to(recipientId).emit('broadcast-chat-message', data);
    // }
  });

  socket.on('disconnect', () => {
    socket.removeAllListeners();
  });
});

module.exports = io;
