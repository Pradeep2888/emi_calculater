const express = require("express");
const productsRouter=express.Router()
const fs=require("fs")
const dotenv=require("dotenv");
const { ProductModel } = require("../models/ProductModel");
const { time } = require("console");
const { BookmarkModel } = require("../models/BookmarkModel");


productsRouter.get("/",async(req,res)=>{
    const data=await ProductModel.find()
    res.send({data:data,"msg":"hi"})
})

productsRouter.post("/addproduct",async(req,res)=>{
    const {title,quantity,priority,discription}=req.body
    
    const new_product= new ProductModel({
        title,
        quantity,
        priority,
        discription
    })
    await new_product.save()

    res.send({new_product})
})


productsRouter.delete("/delete/:id",async(req,res)=>{
    const {id}=req.params
    const data=await ProductModel.findOne({_id:id})
    if(data){
        await ProductModel.deleteOne({_id:id})
        res.send({"msg":"product is deleted","data":data})
    }
    else{
        res.send({"msg":"product not exist more"})   
    }
    console.log(data)
})

productsRouter.delete("/bookmarkdelete/:id",async(req,res)=>{
    const {id}=req.params
    const data=await BookmarkModel.findOne({_id:id})
    if(data){
        await BookmarkModel.deleteOne({_id:id})
        res.send({"msg":"product is deleted","data":data})
    }
    else{
        res.send({"msg":"product not exist more"})   
    }
    console.log(data)
})

productsRouter.post("/createbookmark",async(req,res)=>{
    const {id}=req.body
    const data=await ProductModel.findOne({_id:id})
    if(data){
       


        
        const new_bookmark= new BookmarkModel({
            title:data.title,
            quantity:data.quantity,
            priority:data.priority,
            discription:data.discription,
        })
        console.log(new_bookmark)
        await new_bookmark.save()
        res.send({"msg":"product is add to bookmark","data":data})
    }
    else{
        res.send({"msg":"product not exist more"})   
        }
      
    // console.log(data)
})

productsRouter.get("/bookmark",async(req,res)=>{
    const data=await BookmarkModel.find()
    res.send({data:data,"msg":"hi"})
})


module.exports={productsRouter}