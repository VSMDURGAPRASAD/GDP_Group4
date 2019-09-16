const mongoose = require('mongoose');
const express = require("express");
const http = require('http');
const codewordsjson = require('../data/codewords.json');
const codeword = require('../models/codeword');
const codewordsetjson = require('../data/codewordset.json');
const Codewordset = require('../models/Codewordset');
const coursejson = require('../data/courses.json');
const Course = require('../models/Course');
const sampleJson = require('../data/sample');
const sample = require('../models/Sample');
const userjson = require('../data/users.json');
const user = require('../models/user');

var app = express();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/GDP-4'
mongoose.connect(MONGODB_URI)
.then(() => {
    console.log('DB Connected');
}, err => {
    console.log(err);
});
 
// const smp = new sample({
//     User_name: 'krishna',
//     User_number: '3'
// })
// smp.save(function(error){
//     if(error)
//     return console.log('saving data error',error)
// })



// const cdw = new codeword({
//     codeWordSetName : 'Medium',
//     codeword : 'SCALES'    
// })

// cdw.save(function(error){
//     if(error)
//     return console.log('saving codeword data error',error)
// })

// codeword.collection.insertMany(codewordsjson,function(err){
//     if(err){
//         return console.log("error in adding codeword json", err);
//     }
// })

// Codewordset.collection.insertMany(codewordsetjson,function(err){
//     if(err){
//         return console.log("error in adding codewordset json", err);
//     }
// })

Course.collection.insertMany(coursejson,function(err){
    if(err){
        return console.log("error in adding course json", err);
    }
})

// sample.collection.insertMany(sampleJson,function(err){
//     if(err){
//         return console.log("error in adding sample json", err);
//     }
// })

// user.collection.insertMany(userjson,function(err){
//     if(err){
//         return console.log("error in adding user json", err);
//     }
// })