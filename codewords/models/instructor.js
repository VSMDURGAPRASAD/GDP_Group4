const mongoose = require('mongoose')

const InstructorSchema = new mongoose.Schema({

  //_id: { type: Number, required: true },
  instructoremail: {type:String,required: false},
  coursename: {
    type: String,
    required: true,
    unique: true
    
  },
  startdate: {
    type: Date,
    required: false
    
  },
  enddate: {
    type:Date,
    required: true,
    required: false
   
  },
  intiallink: {
    type: String,
    required: false
    
  },
  finallink: {
    type: String,
    required: false
    
  },
  studentlist: {
    type: String,
    required: false
  },
  codewordsetname: {
    type: String,
    required : false
  }
})
module.exports = mongoose.model('Instructor', InstructorSchema)
