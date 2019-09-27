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
const notfoundstring = 'student not found'
var mongoose = require('mongoose');
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

  for (var i = 0; i < data.length; i++) {

    var tempdata = data[i];
    
    
    if(tempdata.courseId.length>3){

      
      const course =await Course.findOne({_id:tempdata.courseId});
      if(course){
        var check = {};
        check.studentEmail= tempdata.studentEmail;
        check.codeword=tempdata.codeword;
        check.coursename=course.coursename;
        check.intiallink= course.intiallink;
        check.finallink=course.intiallink;//change to final link after data is reset
       
      uidata.push(check);
      console.log(course);
      console.log("check");
      console.log(check);
      }
       

    }
    
     

  }

  res.render('student/student.ejs',{val:uidata})
})




module.exports = api
