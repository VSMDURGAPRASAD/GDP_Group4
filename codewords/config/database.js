const mongoose = require('mongoose');
const express = require("express");
const http = require('http');
const sampleJson = require('../data/sample');
const sample = require('../models/Sample');

var app = express();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/GDP-4'
mongoose.connect(MONGODB_URI)
.then(() => {
    console.log('DB Connected');
}, err => {
    console.log(err);
});


const smp = new sample({
    User_name: 'krishna',
    User_number: '3'
})
smp.save(function(error){
    if(error)
    return console.log('saving data error',error)
})

sample.collection.insertMany(sampleJson,function(err){
    if(err){
        return console.log("error in adding json", err);
    }
})




