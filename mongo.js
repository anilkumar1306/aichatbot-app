const express = require("express");
const mongoose=require("mongoose");
const app = express();
const uri="mongodb+srv://anil:root@cluster0.gd3seox.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
async function connect(){
    try{
        await mongoose.connect(uri);
        console.log("connection successful to accounts database");
    }
    catch(e){
        console.log("connection failed");
    }
}

connect();
    
const newSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required:true
    }
})

const collection = mongoose.model("collection",newSchema)

module.exports = collection