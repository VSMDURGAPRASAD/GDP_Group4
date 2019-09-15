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
    }

     

});

module.exports = mongoose.modle('Course',courseSchema)