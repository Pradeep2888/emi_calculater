const mongoose = require("mongoose")

const productSchema=new mongoose.Schema({
    title:{type:String,required:true},
    quantity:{type:Number,required:true},
    priority:{type:Number,required:true},
    discription:{type:String,required:true},
    
},{
    timestamps:true
})

const ProductModel=mongoose.model("product",productSchema)


module.exports={ProductModel}