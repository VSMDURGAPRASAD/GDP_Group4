const express = require("express")
const http = require('http')
const expressLayouts = require('express-ejs-layouts')
const favicon =require('serve-favicon')
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
const flash = require('connect-flash')


// Load environment variables from .env file, where port, API keys, and passwords are configured.
LOG.info('Environment variables loaded into process.env.')

// create express app ..................................

const app = express()
// const fs = require("fs")

//app.use(require('serve-static')(__dirname + '/../../public'));
app.use(require('cookie-parser')());

// configure app.settings.............................
app.set('port', 8080 )
app.set('host', '127.0.0.1' )

// set the root view folder
app.set('views', path.join(__dirname, 'views'))

// specify desired view engine (EJS)
app.set('view engine', 'ejs')
app.engine('ejs', engines.ejs)

// configure middleware.....................................................
//app.use(favicon(path.join(__dirname, '/public/images/favicon.ico')))

// log every call and pass it on for handling
app.use((req, res, next) => {
  LOG.debug(`${req.method} ${ req.url}`)
  next()
})
app.use(bodyParser.urlencoded({ extended: false }))
// specify various resources and apply them to our application
app.use(bodyParser.json())
//app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }))
app.use(expressLayouts)
app.use(errorHandler()) // load error handler




// Express session
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


//app.use(express.session({ cookie: { maxAge: 60000 }}));
// Connect flash
app.use(flash())
console.log("flash")
