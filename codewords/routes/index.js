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
})

router.post('/forgotpassword',function(req,res,next){
  async.waterfall([
    function (done) {
      crypto.randomBytes(20,function(err,buf){
        var token = buf.toString('hex');
        done(err,token)
      });
      
// Defer path requests to a particular controller
router.use('sample',require('../controllers/sample'))

LOG.debug('END routing')
module.exports = router
