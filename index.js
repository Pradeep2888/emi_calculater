const express = require("express")
const cors = require("cors")
const {connection} = require("./config/db")
const {UserModel} = require("./models/User.model")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { authentication } = require("./middlewares/authentication");
const { EMIModel } = require("./models/EMIModel.js");
require("dotenv").config()

const app = express();
const PORT=process.env.PORT || 8000
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Hello")
})

app.post("/signup", async (req, res) => {
    const {name, email, password} = req.body

    const isUser = await UserModel.findOne({email})
    if(isUser){
        res.send({"msg" : "User already exists, try logging in"})
    }
    else {
        bcrypt.hash(password, 4, async function(err, hash) {
        if(err){
            res.send({"msg":"Something went wrong, please try again later"})
        }
        const new_user = new UserModel({
            name,
            email,
            password : hash
        })
        try{
            await new_user.save()
            res.send({"msg" : "Sign up successfull"})
        }
        catch(err){
            res.send({"msg" : "Something went wrong, please try again"})
        }
    });
}
})


app.post("/login", async (req, res) => {
    const {email, password} = req.body
    const user = await UserModel.findOne({email})
    const hashed_password = user.password;
    const user_id = user._id;
    bcrypt.compare(password, hashed_password, function(err, result) {
          if(err){
            res.send({"msg" : "Something went wrong, try again later"})
          }
          if(result){
            const token = jwt.sign({user_id}, process.env.SECRET_KEY);  
            res.send({"message" : "Login successfull", "token":token})
          }
          else{
            res.send({"msg" : "Login failed"})
          }
    });
})

app.get("/getProfile",authentication, async (req, res) => {
    const {user_id} = req.body
    const user =await  UserModel.findOne({_id : user_id})
    const {name, email} = user
    res.send({name, email})
})

app.post("/calculateEMI", authentication,async (req, res) => {
     const {principal, rate, time,user_id} = req.body;
     const time1=time*12
     const a=time1*(1+rate/100)
     let b=time1-1
     let c=(1+rate/100)*b
     const EMI = principal*rate/100*a/c
     const new_emi = new EMIModel({
        EMI,
          principal,
        time,
        rate,
        user_id
     })
     await new_bmi.save()
     res.send({EMI})
    
})

app.get("/getCalculation", authentication, async (req, res) => {
    const {user_id} = req.body;
    const all_bmi = await EMIModel.find({user_id : user_id})
    res.send({history : all_bmi})
})



app.listen(PORT, async () => {
    try{
        await connection
        console.log("Connection to DB successfully")
    }
    catch(err){
        console.log(err)
        console.log("Error connecting to DB")
    }
    console.log(`Listening on PORT ${PORT}`)
})
