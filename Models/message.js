const mongoose = require("mongoose");

const message = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  messageData: {
    message: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
      default: Date.now(),
    },
    toWhom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
});

module.exports = mongoose.model("message", message);
