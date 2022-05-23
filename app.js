const express = require("express");
const path = require("path");
const app = express();
const Router = require("./Router/Router");
const hbs = require("hbs");
const mongoConnect = require("./mongoConnect");
const { router, saveMessage } = require("./Router/App");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");

const message = require("./Models/message");

mongoConnect();
//middleware
app.use(express.static(path.join(__dirname, "/public")));
require("dotenv").config({ path: path.join(__dirname, "/config.env") });

const viewPath = path.join(__dirname, "/templates/views");
const partialPath = path.join(__dirname, "/templates/partials/");
app.use("/chatApp", Router);
app.use("/app", router);
app.set("view engine", "hbs");
app.set("views", viewPath);
app.use(cookieParser());
hbs.registerPartials(partialPath);
hbs.registerHelper("when", function (operand_1, operator, operand_2, options) {
  // console.log(operand_1, operand_2);
  var operators = {
    'eq': function (l, r) { return l == r; },
    'noteq': function (l, r) { return l != r; },
    'gt': function (l, r) { return Number(l) > Number(r); },
    'or': function (l, r) { return l || r; },
    'and': function (l, r) { return l && r; },
    '%': function (l, r) { return (l % r) === 0; }
  }
    , result = operators[operator](operand_1, operand_2);

  if (result) return options.fn(this);
  else return options.inverse(this);
});


const server = http.createServer(app);
const io = new Server(server);

io.on("connection", function (socket) {
  console.log("Client connected!");
  let currentUserId;
  socket.on('join', id => {
    // console.log(id);
    currentUserId = id;
    socket.join(id);
  })
  socket.on("send", (messageData) => {
    // console.log(messageData);
    socket.in(messageData.Receiverid).emit("recieve", messageData);
    saveMessage(messageData);

  });
  socket.on('disconnect', () => {
    socket.leave(currentUserId);
  });
});

//routes
app.get("/", (req, res) => {
  res.redirect("/chatApp/");
});

server.listen(process.env.PORT, () => {
  console.log(`Server Listening on PORT ${process.env.PORT}`);
});
