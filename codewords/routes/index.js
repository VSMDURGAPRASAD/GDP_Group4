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
// router.get('/', forwardAuthenticated, (req, res) => res.render('index.ejs'));

// router.get('/login', (req, res, next) => {
//   LOG.debug('Request to /')
//   res.render('login.ejs', { title: 'Express App' })
// })
// router.get('/register', (req, res, next) => {
//   LOG.debug('Request to /')
//   res.render('register.ejs', { title: 'Express App' })
// })
router.get('/forgotpassword', (req, res, next) => {
  LOG.debug('Request to /')
  res.render('forgotpassword.ejs', { title: 'Express App' })
});

function checkEmail(token,done){
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
}
function authMail(token, user, done){
  var smptTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'sneharao0806@gmail.com',
      pass: process.env.GMAILPW
    }
  });
  var mailOption = {
    to: user.email,
    from: 'sneharao0806@gmail.com',
    subject: 'password reset',
    text: 'You have requrested for the password  reset link for express app'+
          ' To reset your password Please click the link below'+'http://'+req.header.host + '/reset/' + token + '\n\n' + 
          'If you did not requested to change password ignore this email'
  };
  smptTransport.sendMail(mailOption,function(err){
    console.log('mail sent');
    req.flash('Success','An email sent to your' +  user.email);
    done(err,'done');
  });
}
 function end(err){
if (err) return next(err);
res.redirect('/forgot');
 }
// Defer path requests to a particular controller
// router.use('sample',require('../controllers/sample'))

LOG.debug('END routing')

module.exports = router