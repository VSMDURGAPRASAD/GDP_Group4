const express = require("express");
const app = express();

app.set('view-engine','ejs');


app.get('/',function(req,res){
    res.render('index.ejs');
});

app.get('/login',function(req,res){
    res.render('login.ejs');

})
app.get('/register',function(req,res){
    res.render('register.ejs');
})
app.listen(3000);