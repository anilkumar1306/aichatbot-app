const express = require("express");
const mongoose=require("mongoose");
const app = express();
const uri="mongodb+srv://anil:root@cluster0.gd3seox.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
async function connect(){
    try{
        await mongoose.connect(uri);
        console.log("connection successful to booking end database");
    }
    catch(e){
        console.log("connection failed");
    }
}

connect();
    
const newSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    }, sourceLocation:{
        type: String,
        required: true
    }, destinationLocation:{
        type: String,
        required: true
    }, travelDate:{
        type: String,
        required: true
    }, busType:{
        type: String,
        required: true
    }, seats:{
        type: Number,
        required: true
    }, totalPrice:{
        type: Number,
        required: true
    }, transactionHash:{
        type: String,
        required: true
    }, publicAddress:{
        type: String,
        required: true
    }, privateAddress:{
        type: String,
        required: true
    }
})

const bookingend = mongoose.model("bookingend",newSchema)

module.exports = bookingend