const jwt = require("jsonwebtoken");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "../config.env") });

const middleware = {
  Authenticate: (req, res, next) => {
    const token = req?.cookies?.token;

    if (token == undefined || token == null || token === "") {
      return res.redirect("/chatApp/login");
    }

    jwt.verify(token, process.env.SECRETKEY, (err, decode) => {
      if (err) return res.redirect("/chatApp/login");

      // console.log(decode.id);
      res.mail = req?.cookies?.mail;
      res.id = decode.id;
      next();
    });
  },
};

module.exports = middleware;
