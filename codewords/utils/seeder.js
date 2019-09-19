// const Datastore = require('nedb')
// const LOG = require('../utils/logger.js')
// const users = require('../data/users.json')
// module.exports = (app) => {
//     LOG.info('START seeder.')
//     const db = {}
  
//     db.users = new Datastore()
//     db.users.loadDatabase()
  
//     // insert the sample data into our data store
//     db.users.insert(users)
  
//     // initialize app.locals (these objects will be available to our controllers)
//     app.locals.users = db.users.find(users)
//     LOG.debug(`${app.locals.users.query.length} products seeded`)
    
//     LOG.info('END Seeder. Sample data read and verified.')