const express = require("express")
const cors = require("cors")
const {connection} = require("./config/db")
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { authentication } = require("./middlewares/authentication");
require("dotenv").config()

const app = express();
const PORT=process.env.PORT || 8000
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Hello")
})

const { productsRouter}=require("./routes/product.route")
app.use("/product",productsRouter)


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
