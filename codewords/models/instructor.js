/** 
*  Instructor Page 
*  Describes the features of a Instructor
*
* @author VSMDURGAPRASAD <dp.vinukonda@gmail.com>
*
*/

// see <https://mongoosejs.com/> for more information
const mongoose = require('mongoose')

const InstructorSchema = new mongoose.Schema({
  _courseName: { type: String, required: true },
  startDate: { type: Date, required: true, default: Date.now() },
  endDate: { type: Date, required: false },
  intialSurveyLink: { type: String, },
  endSurveyLink: { type: Boolean, default: false },
  
})

module.exports = mongoose.model('Instructor',InstructorSchema)