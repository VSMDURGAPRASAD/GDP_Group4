var mongoose = require ('mongoose');
var validator = require('validator');
var mongoosePaginate = require('mongoose-paginate');


var CourseUserSchema = new Schema ({

    CourseName: {
        type: String,
        require: true,
        unique: true
    },
    
    email_id: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        validate:{
            validator: (value) =>{
                return validator.isEmail(value);
            }        
    },

    first_name: {
        type: String
    },
    last_name: {
        type: String
    },



});

