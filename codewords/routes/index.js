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
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

LOG.debug('START routing')
const router = express.Router()
router.get('login/login.ejs', (req, res, next) => {
  LOG.debug('Request to /login')
  res.render('login.ejs', { title: 'Express App' })
})
//Manage top-level request first
router.get('/', ensureAuthenticated,(req, res, next) => {
  LOG.debug('Request to /')
  res.render('index.ejs', { title: 'Express App' })
})

// Defer path requests to a particular controller

router.use('/instructor',ensureAuthenticated, require('../controllers/instructor.js'))
router.use('/users', require('../controllers/users.js'))


LOG.debug('END routing')
module.exports = router
