const express = require("express");
const router = express.Router();
const middleware = require("../Middleware/Middleware");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const message = require("../Models/message");
const user = require("../Models/users");
const { default: mongoose } = require("mongoose");
const crypto = require('crypto');

//middlewares
router.use(express.static(path.join(__dirname, "../public")));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser());
router.use(express.static("/opt/lampp/htdocs/testproject/"));


//routes
router.get("/", middleware.Authenticate, async (req, res) => {

  const userList = await user
    .find({ _id: { $ne: res.id } }, { password: 0 })
    .exec();

  res.render("index", {
    userList,
    mailId: res.mail,
    userId: res.id,

  });
});

router.get("/getMessage", middleware.Authenticate, async (req, res) => {
  try {
    const messageList = await message
      .find({ $or: [{ $and: [{ "messageData.toWhom": mongoose.Types.ObjectId(req.query.id) }, { "user": mongoose.Types.ObjectId(res.id) }] }, { $and: [{ "user": mongoose.Types.ObjectId(req.query.id) }, { "messageData.toWhom": mongoose.Types.ObjectId(res.id) }] }] }, {}, { sort: { "messageData.time": 1 } }).exec();

    res.render("messages", {
      messageList,
      userMail: req.query.mail,
      receiver: req.query.id,
      name: req.query.name,
      userId: res.id,
    });
  } catch (err) {
    console.log(err);
  }
});


const saveMessage = async (messageData) => {

  let msg = new message({
    user: messageData.senderId,
    messageData: {
      message: messageData.message,
      time: new Date(Date.now()).toUTCString(),
      toWhom: messageData.Receiverid
    }
  })
  try {
    await msg.save();
  } catch (err) {
    console.log(err);
  }
}

module.exports = { router, saveMessage };

