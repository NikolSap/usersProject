//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const app = express();
const mongoose= require('mongoose');
const encrypt = require('mongoose-encryption');

console.log(process.env.API_KEY)

app.use(express.static("public"))
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({
  extended:true
}));
mongoose.connect("mongodb://127.0.0.1:27017/userDB", { useNewUrlParser: true });
const db = mongoose.connection;
console.log("Connected to MongoDB");



const userSchema=new mongoose.Schema ({
    email: String,
    password: String

});

userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields:['password']});

const User= new mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home")

})
app.get("/login",function(req,res){
    res.render("login")

})

app.post("/login",async function(req,res){
    const username=req.body.username;
    const password=req.body.password;
    const user = await User.findOne({email: username});
    console.log(user);
    console.log(password)
    res.render("secrets");
     
     
})
app.get("/register",function(req,res){
    res.render("register")

})
app.get("/secrets",function(req,res){
    res.render("secrets")

})
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
          console.error(err);
          res.redirect("/register");
      } else {
          const newUser = new User({
              email: username,
              password: hash
          });
          newUser.save((err) => {
              if (err) {
                  console.error(err);
                  res.redirect("/register");
              } else {
                  res.render("secrets");
              }
          });
      }
  });
});
app.listen(3000,function(req,res){
  console.log("Server started on port 3000.");
})