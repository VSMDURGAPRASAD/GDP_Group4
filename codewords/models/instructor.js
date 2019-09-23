const mongoose = require('mongoose')

const InstructorSchema = new mongoose.Schema({

  _id: { type: Number, required: true },
  coursename: {
    type: String,
    required: true,
    unique: true
    
  },
  startdate: {
    type: String,
    required: false
    
  },
  