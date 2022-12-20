const express =require('express');
const cors = require('cors')
const fs = require('fs')
let users = require('./user.json')
const bodyParser = require('body-parser')
require("dotenv").config()
const app = express()
app.set("view engine","ejs")
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.json())
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const session = require("express-session");
app.use(session({
  secret:'Secret Message',
  cookie:{maxAge:60000},
  resave:false,
  saveUninitialized:false
}))
const { getemps, getemp, createemp, updateemp,removeemp } = require('./controller')
app.get('/',(req,res)=>{  res.render('index')})
app.get('/employee',(req,res)=>{  getemps(req,res)})
app.get('/employee/:id',(req,res)=>{getemp(req,res,parseInt(req.params.id))})
app.post('/employee/update/:id',(req,res)=>{updateemp(req,res,req.params.id)})
app.post('/employee/delete/:id',(req,res)=>{removeemp(req,res,req.params.id)})
app.post('/employee/add',(req,res)=>{createemp(req,res)})
app.get('/user/register',(req,res)=>{ res.render('register') })
app.post('/user/register',async (req,res)=>{
    const user = req.body;
    if (!user.username || !user.password) {
        return res.status(400).send("Username and password are required.");
    }
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
    users.push(user);
    fs.writeFileSync('./user.json',JSON.stringify(users),'utf8',(err) => {
        if(err){ console.log(err );}
    })
    res.redirect('/index.ejs');
})
app.post("/user/login", async (req, res) => {
    const user = req.body;
    const foundUser = users.find((user) => user.username === req.body.username);
    if (!foundUser) {
      return res.status(400).send("Invalid username or password");
    }
    const isPasswordValid = await bcrypt.compare(
      user.password,
      foundUser.password
    );
    if (!isPasswordValid) {
      return res.status(400).send("Invalid Username or password");
    }
    const token = jwt.sign({ user }, "Secret Message",{
      expiresIn: "1h",
    });
    console.log(token);
    //req.session.token = token;
    res.redirect('/employee')
  });
app.listen(3000,()=>{console.log('server started');}); 