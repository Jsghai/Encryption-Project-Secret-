//jshint esversion:6

require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")



app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://127.0.0.1:27017/secrets", {useNewUrlParser: true});

const userS = new mongoose.Schema({
  email: String,
  password: String
});


userS.plugin(encrypt, {secret:process.env.SECRET, encryptedFields: ["password"]});




const User = new mongoose.model("User", userS )




app.get("/", function(req, res){
	res.render("home");
});

app.get("/login", function(req, res){
	res.render("login");
});

app.get("/register", function(req, res){
	res.render("register");
});

app.post("/register", function (req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets")
    }
  });
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function (err, found) {
    if (err) {
  console.log(err);
} else {
  if (found) {
    if (found.password === password) {
      res.render("secrets")
    }
  }
}
  })
})

app.listen(3000, function(){
	console.log("Server started");
});
