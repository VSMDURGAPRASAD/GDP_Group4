const express = require("express")
const http = require('http')
const expressLayouts = require('express-ejs-layouts')
const users=[]
const favicon = require('serve-favicon')
const path = require('path')
const bodyParser = require('body-parser')
const engines = require('consolidate')
const session = require('express-session')
const errorHandler = require('errorhandler')
const dotenv = require('dotenv')
const logFile = '/access.log'
const mongoose = require('mongoose')
const expressValidator = require('express-validator')
const expressStatusMonitor = require('express-status-monitor')
const LOG = require('./utils/logger.js')


// create express app ..................................

const app = express()
// const fs = require("fs")

// Load environment variables from .env file, where API keys and passwords are configured.
// dotenv.load({ path: '.env.example' })
dotenv.load({ path: '.env' })
LOG.info('Environment variables loaded.')

// app variables
const port = 3000 || process.env.PORT


// configure app.settings.............................
app.set('port', process.env.PORT || port)

// set the root view folder
app.set('views', path.join(__dirname, 'views'))
app.use("/public", express.static(path.join(__dirname, 'public')));

// specify desired view engine
app.set('view engine', 'ejs')
//....app.engine('ejs', engines.ejs)

// configure middleware.....................................................
//app.use(favicon(path.join(__dirname, '/public/images/favicon.ico')))
app.use(expressStatusMonitor())

// log calls
app.use((req, res, next) => {
  LOG.debug('%s %s', req.method, req.url)
  next()
})

// specify various resources and apply them to our application
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
//app.use(expressValidator())
app.use(express.static('public'))
//app.use(expressLayouts)
app.use(errorHandler()) // load error handler

const routes = require('./routes/index')
app.use('/', routes)  // load routing


LOG.info('Loaded routing.')
app.use(express.urlencoded({extended : false}))

app.get("/", function(req, res){
  res.render("index.ejs")
})
app.get('/course',function(req,res){
  res.render("course.ejs");
})
app.get('/admin',function(req,res){
  res.render("admin.ejs");
})

app.get('/student' ,function(req,res){
  res.render('student.ejs');
})
app.get('/instructor' ,function(req,res){
  res.render('instructor.ejs');
})

app.get('/login',function(req,res){
    res.render('login.ejs');

})
app.post('/login',function(req,res){
  req.body.email

})
app.get('/register',function(req,res){
    res.render('register.ejs');
})

app.post('/admin',function(req,res){

})
app.post('/student',function(req,res){

})
app.get('/fpwd' ,function(req,res){
  res.render('fpwd.ejs');
})
app.post('/fpwd',function(req,res){

})

app.post('/instructor',function(req,res){

})
app.use((req, res) => { 
  res.status(404).render('404.ejs') 
}) 
// handle page not found errors

// initialize data ............................................
require('./config/database.js')  // load seed data

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));

// start Express app
app.listen(process.env.PORT || port, function() {
  console.log('App is running at http://localhost:' + port)
  console.log('\n Logs will be sent to this terminal and ' + logFile )
})

module.exports = app

