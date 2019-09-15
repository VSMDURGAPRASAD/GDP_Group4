var mongoose = rewuire ('mongoose');
var validator = require('validator');

var courseSchema = new Schema ({
    CourseName: {
        type: String,
        require: true,
        unique: true
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
        type: File
    },

    CodewordSet: {
        type: String
    }
    

});

module.exports = mongoose.modle('Course',courseSchema)