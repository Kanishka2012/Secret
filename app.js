require("dotenv").config();
const express=require("express");
const ejs=require("ejs");
const bodyParser =require("body-parser");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

const app=express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.set("strictQuery",true);
mongoose.connect("mongodb://localhost:27017/userDB");
app.get("/",function(req,res){
    res.render("home");
});

const userSchema=new mongoose.Schema({
    email:{type:String,required:true},
    password:{type:String,required:true}
});


userSchema.plugin(encrypt,{secret:process.env.secret, encryptedFields:["password"]});

const User=mongoose.model("User",userSchema);

app.get("/login",function(req,res){
    res.render("login");
})

app.get("/register",function(req,res){
    res.render("register");
})

app.post("/register",function(req,res){
    const user=new User({
        email:req.body.username,
        password:req.body.password
    });
    user.save();
    res.render("secrets");
});

app.post("/login",function(req,res){
    User.findOne({email:req.body.username},function(err,founduser){
        if(err) console.log(err);
        else{
            if(founduser){
                if(founduser.password==req.body.password) res.render("secrets");
            }
        }
    })
});














app.listen(3000,function(){
    console.log("Server listening to port 3000");
});