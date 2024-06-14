const express = require("express");
const mongoose=require("mongoose");
const app = express();
const uri="mongodb+srv://anil:root@anil.c2fnmlr.mongodb.net/?retryWrites=true&w=majority&appName=anil"
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
    },
    sourceLocation:{
        type: String,
        required: true
    },
    destinationLocation:{
        type: String,
        required: true
    },
    dateTime:{
        type: Date,
        required: true
    },
    busType:{
        type: String,
        required: true
    },
    seatNumber:{
        type: Number,
        required: true
    },
})

const bookingend = mongoose.model("bookingend",newSchema)

module.exports = bookingend