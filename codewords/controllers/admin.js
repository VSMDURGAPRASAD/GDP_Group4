/** 
*  Instructor Course controller
*  Handles requests related to instructors (see routes)

*  Vinukonda Sai Manikanta Durga Prasad
* 
*
*/
const express = require('express')
const api = express.Router()
const LOG = require('../utils/logger.js')
const find = require('lodash.find')
const remove = require('lodash.remove')
const Model = require('../models/studentcourse.js')
const Course = require('../models/instructor.js')
var mongoose = require('mongoose');
const Usermodel = mongoose.model('User')
const notfoundstring = 'student not found'
const _ = require('lodash');
let XLSX = require('xlsx')
const formidable = require('formidable')
var fs = require('fs');
var path = require('path');
const ObjectId = require('mongodb').ObjectID;

//var util = require("util");
//var fs = require("fs"); 

// RESPOND WITH JSON DATA  --------------------------------------------

// GET all JSON
api.get('/findall',async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  const data = await Model.find({})

  var contents = fs.readFileSync("jsoncontent.json");
  // Define to JSON type
  var jsonContent = JSON.parse(contents);
   console.log(jsonContent)
  res.send(JSON.stringify(data))
})

api.get('/',async (req, res) => {

  const data = await Model.find();

  const uidata= [];




  console.log(data);

  

  res.redirect('admin/addinstructor')
})

api.get('/addinstructor',async (req, res) => {

    const data = await Usermodel.find({requestforInstructorAcess:true});
  
    const uidata= data;
    
   // console.log(data);
  
    
  
    res.render('admin/addinstructor.ejs',{layout:false,val:uidata})
  })

  api.get('/removeinstructor',async (req, res) => {

    const data = await Model.find();
  
    const uidata= [];
  
  
  
  
    console.log(data);
  
    
  
    res.render('admin/removeinstructor.ejs',{layout:false,val:uidata})
})
api.get('/inactiveaccount',async (req, res) => {

})

api.post('/requestForInstructorAcess',async(req,res)=>{

  //console.log(req.body.IsAgreed)

  var items = await Usermodel.find({email:req.body.InstructorEmail}) 

  console.log(req.body.IsAgreed)
  var item = items[0]
  if(req.body.IsAgreed=="true"){

    item.requestforInstructorAcess = false;
    item.isInstructor = true;

    console.log(item)
    try{
      await item.save()
    }
    catch (err) {
      res.status(500).send(err);
    }
  }
  else{
    item.requestforInstructorAcess = false;
    item.isInstructor = false;

    console.log(item)
    try{
      await item.save()
    }
    catch (err) {
      res.status(500).send(err);
    }
    
  }
 
  //console.log(req.body.InstructorEmail)
  // Instructor Email

  res.send('admin/addinstructor')


})

module.exports = api
