const express = require("express");
const app = express();
app.get('/',function(req,res){
    res.render('index.ejs');
});
app.listen(3000);