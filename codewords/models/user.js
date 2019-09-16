var mongoose = require('mongoose');
var validator = require('validator');

var UserSchema = new mongoose.Schema({
    email_id: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        
        },
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['admin', 'student', 'instructor'],
        require: true
    },
    is_active: {
        type: Boolean,
        require: true,
        default: false
    },
    last_login: {
        type: Date,
    },
    course: [
        {
            course_id: { type: String },
            isRevealed: { type: Boolean }
        }

    ],
    codewordset: [
        {
            codewordsetname: { type: String }
        }
    ],
    created_at: {
        type: Date
    },
    updated_at: {
        type: Date,
    }

});
module.exports = mongoose.model('user',UserSchema)