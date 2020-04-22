require('dotenv').config( );
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended : true }));
app.use(express.static("public"));

//////////////// Mongo DB Connection /////////////////////////

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser : true, useUnifiedTopology :true });

const userSchema = new mongoose.Schema({

    email : String,
    password : String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET , encryptedFields : ["password"] });

const User = mongoose.model("User", userSchema);


//////////////////////// Route Script //////////////////////////////////////////

app.get("/", function(req, res){

    res.render("home");
});


app.get("/login", function(req, res){

    res.render("login");
});

app.get("/registration", function(req, res){

    res.render("registration");
});


app.get("/secreat", function(req, res){

    res.render("secreat");
});




app.post("/register", function(req, res){

    const userEmail = req.body.email;
    const userPassword = req.body.password;

    const user = new User({

        email : userEmail,
        password : userPassword
    });

    user.save(function(err){

        if(err){
            res.render(err)
        } else {
            res.render("secreat");
        }
    });

});


app.post("/login", function(req, res){

    const userEmail = req.body.email;
    const userPassword = req.body.password;

    User.findOne({email : userEmail}, function(err, foundUSer){

        if(err){
            res.render(err);
        } else{

           if(foundUSer) {
               if(foundUSer.password === userPassword ){

                    res.render("secreat")
               }
           }
        }
    });
});


///////////////////////// SERVER SCRIPT ////////////////////////////////

app.listen(3000, function(req, res){


    console.log("server is running on port 3000");
})