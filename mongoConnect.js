const mongoose = require("mongoose");

const uri = "mongodb://localhost:27017/ChatApp";

const ConnectMongodb = () => {
  mongoose
    .connect(uri)
    .then((res) => {
      console.log("mongodb connected Successfully");
    })
    .catch((err) => {
      console.log("Error to connect Mongodb");
    });
};
module.exports = ConnectMongodb;
