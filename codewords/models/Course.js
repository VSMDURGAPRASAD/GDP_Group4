const mongoose = require ('mongoose');
// const validator = require('validator');

const courseSchema = new mongoose.Schema ({
    CourseName: {
        type: String,
        require: true,
        //unique: true
    },

    StartDate: {
        type: DataView
    },
    
    EndDate: {
        type: DataView
    },

    InitialSurveyLink: {
         type: URL
    },

    FinalSurveyLink: {
        type: URL

    },

    StudentList: {
        type: String
    },

    CodewordSet: {
        type: String
    }
    

});

module.exports = mongoose.model('Course',courseSchema)