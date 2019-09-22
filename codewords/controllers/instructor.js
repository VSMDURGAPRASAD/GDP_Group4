/** 
*  Instructor Course controller
*  Handles requests related to instructors (see routes)

*  Vinukonda Sai Manikanta Durga Prasad
* 
*
*/
const express = require('express')
const api = express.Router()
const LOG = require('../utils/logger.js')
const find = require('lodash.find')
const remove = require('lodash.remove')
const Model = require('../models/instructor.js')
const notfoundstring = 'instructor not found'

// RESPOND WITH JSON DATA  --------------------------------------------

// GET all JSON
api.get('/findall',async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  const data = await Model.find({})
  res.send(JSON.stringify(data))
})

// GET one JSON by ID
api.get('/findone/:id', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  const id = parseInt(req.params.id)
  const data = req.app.locals.instructors.query
  const item = find(data, { _id: id })
  if (!item) { return res.end(notfoundstring) }
  res.send(JSON.stringify(item))
})

// RESPOND WITH VIEWS  --------------------------------------------

// GET to this controller base URI (the default)
api.get('/',async (req, res) => {

  const data = await Model.find({})
  console.log("sdf")
  res.render('instructor/index.ejs',{val:data})
})

// api.get('/index', (req, res) => {
//   res.render('instructor/index.ejs')
// })

// GET create
api.get('/create', (req, res) => {
  LOG.info(`Handling GET /create${req}`)
  const item = new Model()
  LOG.debug(JSON.stringify(item))
  res.render('instructor/create',
    {
      title: 'Create instructor',
      layout: 'layout.ejs',
      instructor: item
    })
})

// GET /delete/:id
api.get('/delete/:id', (req, res) => {
  LOG.info(`Handling GET /delete/:id ${req}`)
  const id = parseInt(req.params.id)
  const data = req.app.locals.instructors.query
  const item = find(data, { _id: id })
  if (!item) { return res.end(notfoundstring) }
  LOG.info(`RETURNING VIEW FOR ${JSON.stringify(item)}`)
  return res.render('instructor/delete.ejs',
    {
      title: 'Delete instructor',
      layout: 'layout.ejs',
      instructor: item
    })
})

// GET /details/:id
api.get('/details/:id', (req, res) => {
  LOG.info(`Handling GET /details/:id ${req}`)
  const id = parseInt(req.params.id)
  const data = req.app.locals.instructors.query
  const item = find(data, { _id: id })
  if (!item) { return res.end(notfoundstring) }
  LOG.info(`RETURNING VIEW FOR ${JSON.stringify(item)}`)
  return res.render('instructor/details.ejs',
    {
      title: 'instructor Details',
      layout: 'layout.ejs',
      instructor: item
    })
})

// GET one
api.get('/edit/:id',async (req, res) => {
  LOG.info(`Handling GET /edit/:id ${req}`)
  const id = parseInt(req.params.id)
  //const data = req.app.locals.instructors.query
  const item = await Model.find({ _id:id})
  console.log(item)
  if (!item) { return res.end(notfoundstring) }
  LOG.info(`RETURNING VIEW FOR${JSON.stringify(item[0])
  }`)
  return res.render('instructor/edit.ejs',
    {
      title: 'instructors',
      layout: 'layout.ejs',
      instructors: item[0]
    })
})

// HANDLE EXECUTE DATA MODIFICATION REQUESTS --------------------------------------------

// POST new
api.post('/save', async (req, res) => {
  LOG.info(`Handling POST ${req}`)
  LOG.debug(JSON.stringify(req.body))
  const data = req.app.locals.instructors.query
  const item = new Model()
  LOG.info(`NEW ID ${req.body._id}`)
  //console.log('usser'+req.user.)
  item._id = parseInt(req.body._id)
  item.coursename=req.body.coursename
  item.startdate = req.body.startdate
  item.enddate = req.body.enddate
  item.intiallink= req.body.finallink
  item.studentlist = req.body.studentlist
  item.codewordsetname = req.body.codewordsetname



  try {
   
     await item.save();
     res.send(item);
   } catch (err) {
     res.status(500).send(err);
   }



  LOG.info(`SAVING NEW instructor ${JSON.stringify(item)}`)
  return res.redirect('/instructor')
})

// POST update
api.post('/save/:id', (req, res) => {
  LOG.info(`Handling SAVE request ${req}`)
  const id = parseInt(req.params.id)
  LOG.info(`Handling SAVING ID=${id}`)

  const item = Model.find({ _id: id })
  //item= item[0]
  if (!item) { return res.end(notfoundstring) }
  LOG.info(`ORIGINAL VALUES ${JSON.stringify(item)}`)
  LOG.info(`UPDATED VALUES: ${JSON.stringify(req.body)}`)
  item.coursename = req.body.coursename
  item.startdate = req.body.startdate
  item.enddate = req.body.enddate
  item.intiallink= req.body.finallink
  item.studentlist = req.body.studentlist
  item.codewordsetname = req.body.codewordsetname
  //item.unitPrice = parseInt(req.body.unitPrice)
  LOG.info(`SAVING UPDATED instructor ${JSON.stringify(item)}`)
  return res.redirect('/instructor')
})

// DELETE id (uses HTML5 form method POST)
api.post('/delete/:id', (req, res) => {
  LOG.info(`Handling DELETE request ${req}`)
  const id = parseInt(req.params.id)
  LOG.info(`Handling REMOVING ID=${id}`)
  const data = req.app.locals.instructors.query
  const item = find(data, { _id: id })
  if (!item) { return res.end(notfoundstring) }
  if (item.isActive) {
    item.isActive = false
    console.log(`Deacctivated item ${JSON.stringify(item)}`)
  } else {
    const item = remove(data, { _id: id })
    console.log(`Permanently deleted item ${JSON.stringify(item)}`)
  }
  return res.redirect('/instructor')
})

module.exports = api
