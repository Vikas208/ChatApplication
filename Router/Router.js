const express = require("express");
const router = express.Router();
const path = require("path");
const register = require("../Models/users");
const bodyParser = require("body-parser");
const validator = require("express-validator");
const bcrypt = require("bcrypt");
const users = require("../Models/users");
const jwt = require("jsonwebtoken");
const middleware = require("../Middleware/Middleware");
const cookieParser = require("cookie-parser");

require("dotenv").config({ path: path.join(__dirname, "../config.env") });

router.use(express.static(path.join(__dirname, "./public")));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(cookieParser());

const loginDetails = {
  action: "/chatApp/login",
  title: "Login",
  link: "/chatApp/register",
  message: "Create new Account",
  error: undefined,
};

const registerDetails = {
  action: "/chatApp/register",
  title: "Register",
  link: "/chatApp/login",
  message: "Already have an Account",
  isRegister: true,
  error: undefined,
};

router.get("/", (req, res) => {
  res.redirect("/app");
});

router.get("/register", (req, res) => {
  res.render("AddUser", registerDetails);
});
router.get("/login", (req, res) => {
  res.render("AddUser", loginDetails);
});

router.post(
  "/register",
  validator.body("mail").isEmail(),
  validator.body("password").isLength(6),
  async (req, res) => {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = new register({
      mail: req.body.mail,
      password: bcrypt.hashSync(req.body.password, 10),
      name: req.body.name,
    });
    try {
      await user.save();
    } catch (err) {
      //       console.log(err);
      registerDetails.error = "User has Already Registered";
      return res.render("AddUser", registerDetails);
    }
    res.status(201).redirect("/chatApp/login");
  }
);

router.post("/login", async (req, res) => {
  users.findOne({ mail: req.body.mail }).exec((err, user) => {
    if (err) {
      loginDetails.error = "Something is Wrong";
      return res.render("AddUser", loginDetails);
    } else {
      if (!user) {
        loginDetails.error = "No Such user found";
        return res.render("AddUser", loginDetails);
      }
      let isTrue = bcrypt.compareSync(req.body.password, user.password);
      if (isTrue) {
        let token = jwt.sign({ id: user._id }, process.env.SECRETKEY, {
          expiresIn: 86400,
        });
        res.cookie("token", token, {
          maxAge: 86400000,
          httpOnly: true,
        });
        res.cookie("mail", req.body.mail, {
          maxAge: 86400000,
          httpOnly: true,
        });

        return res.redirect("/app");
      } else {
        loginDetails.error = "Bad Credentials";
        return res.render("AddUser", loginDetails);
      }
    }
  });
});

router.delete("/logout", (req, res) => {});
module.exports = router;
