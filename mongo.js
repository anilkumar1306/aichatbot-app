const express = require("express");
const mongoose=require("mongoose");
const app = express();
const uri="mongodb+srv://anil:anil@anil.xvzmcpe.mongodb.net/?retryWrites=true&w=majority&appName=anil"
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