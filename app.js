//load environment variables into process
require("dotenv").config();
require("./config/database").connect();

const auth = require("./middleware/auth");
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

// importing user context

const functionality = require("./middleware/functionality.js")

//landing page
app.get("/", (req, res) => {
  return res.json({ message: "Hello World 🇵🇹 🤘" });
});

// Register
app.post("/register", (req, res) => {
    functionality.register(req, res);
});

// Login
// app.post("/login", (req, res) => {
//     functionality.login(req, res);
// });

// Login
app.post("/login", (req, res) => {
  functionality.login(req, res);
});

//logout
app.get("/logout", auth, (req, res) => {
  functionality.logout(req, res);
});



app.get("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome to FreeCodeCamp 🙌");
});


module.exports = app;
