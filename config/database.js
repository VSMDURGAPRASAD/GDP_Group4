var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/GDP-4')
.then(() => {
    console.log('DB Connected');
}, err => {
    console.log(err);
});
