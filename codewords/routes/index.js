/**
 * @index.js - manages all routing
 *
 * router.get when assigning to a single request
 * router.use when deferring to a controller
 *
 * @requires express
 */

const express = require('express')
const LOG = require('../utils/logger.js')

LOG.debug('START routing')
const router = express.Router()

// Manage top-level request first
router.get('/', (req, res, next) => {
  LOG.debug('Request to /')
  res.render('index.ejs', { title: 'Express App' })
})
router.get('/login', (req, res, next) => {
  LOG.debug('Request to /')
  res.render('login.ejs', { title: 'Express App' })
})
router.get('/register', (req, res, next) => {
  LOG.debug('Request to /')
  res.render('register.ejs', { title: 'Express App' })
})
router.get('/forgotpassword', (req, res, next) => {
  LOG.debug('Request to /')
  res.render('forgotpassword.ejs', { title: 'Express App' })
});

},
function(token,done){
  User.findOne({ email:req.body.email}, function(err,user){
    if(!user){
      req.flash('error', "The entered email address is not registered with the Express App");
      return res.redirect('/forgotpassword');
    }
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000;

    user.save(function(err){
      done(err,token,user);
    });
  });
},
// Defer path requests to a particular controller
router.use('sample',require('../controllers/sample'))

LOG.debug('END routing')
module.exports = router
