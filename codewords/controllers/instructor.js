/** 
*  Instructor Course controller
*  Handles requests related to instructors (see routes)

*  Vinukonda Sai Manikanta Durga Prasad
* 
*
*/
const express = require('express')
const api = express.Router()
const app = express()
const LOG = require('../utils/logger.js')
const find = require('lodash.find')
const remove = require('lodash.remove')
const Model = require('../models/instructor.js')
const Codeword = require('../models/codeword.js')
const notfoundstring = 'instructor not found'
var mongoose = require('mongoose');
const _ = require('lodash');
let XLSX = require('xlsx')
const formidable = require('formidable')
var fs = require('fs');
var path = require('path');
var Studencourse = require('../models/studentcourse.js');
const upload = require("express-fileupload");
//const Codeword = require('../models/codeword.js');
//var util = require("util");
//var fs = require("fs"); 

// RESPOND WITH JSON DATA  --------------------------------------------

// GET all JSON

app.use(upload())

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

api.post('/deletecodeword/:id', async (req, res) => {
  LOG.info(`Handling DELETE request ${req}`)
  const id = req.params.id
  LOG.info(`Handling REMOVING ID=${id}`)
  const values =await Codeword.findOne({ _id: id })
 // console.log(item)
  if (!values) { return res.end(notfoundstring) }
  
    await Codeword.remove( { _id: id })
    console.log(`Permanently deleted item ${JSON.stringify(values)}`)
  
  return res.redirect('/instructor/codewords')
})
// RESPOND WITH VIEWS  --------------------------------------------

// GET to this controller base URI (the default)
api.get('/',async (req, res) => {

  const data = await Model.find({instructoremail:req.user.email})
  var newdata = []

  console.log(data.length)
  for(i=0;i<data.length;i++){

    let currentdata = data[i];
     
     var temp = currentdata._id+""
    var check = await Studencourse.find({courseId:temp})
    currentdata.assignedCount = check.length

    

    var readcount = 0;

    for(j=0;j<check.length;j++){
        
      if(check[j].isRead){

        readcount = readcount + 1

      }
      

    }



    currentdata.readCount = readcount;
    if(check[0]){
      currentdata.iscodeRevealed = check[0].iscodeRevealed
    }else{
      currentdata.iscodeRevealed = false;
    }



    


     
     newdata.push(currentdata)

  }

 

  res.render('instructor/index.ejs',{val:newdata})
})

// api.get('/index', (req, res) => {
//   res.render('instructor/index.ejs')
// })

// GET create
api.get('/create',async (req, res) => {
  LOG.info(`Handling GET /create${req}`)
  const item = new Model()
  LOG.debug(JSON.stringify(item))

  const codeowordvals= await Codeword.find()
   


  res.render('instructor/create',
    {
      title: 'Create instructor',
      layout: 'layout.ejs',
      instructor: item,
      codewords: codeowordvals
    })
})

// GET /delete/:id
api.get('/delete/:id',async (req, res) => {
  LOG.info(`Handling GET /delete/:id ${req}`)
  const id = req.params.id
  const data = req.app.locals.instructors.query
  const item =await Model.findOne( { _id: id })
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
  const id = req.params.id
  //const data = req.app.locals.instructors.query
  const item = await Model.find({ _id:id})

  item.startdate = new Date(item.startdate).getTime(); 
  const codwordvals = await Codeword.find()
  console.log(item)
  if (!item) { return res.end(notfoundstring) }
  LOG.info(`RETURNING VIEW FOR${JSON.stringify(item[0])
  }`)
  return res.render('instructor/edit.ejs',
    {
      title: 'instructors',
      layout: 'layout.ejs',
      instructors: item[0],
      codewords: codwordvals
    })
})

// HANDLE EXECUTE DATA MODIFICATION REQUESTS --------------------------------------------

api.get('/viewstudents/:id',async (req, res) => {
  LOG.info(`Handling GET /viewstudents/:id ${req}`)
  const id = req.params.id
  const data = req.app.locals.instructors.query
  const item =await Model.findOne( { _id: id })
  if (!item) { return res.end(notfoundstring) }
  LOG.info(`RETURNING VIEW FOR ${JSON.stringify(item)}`)
  let students = []
  // for(let i =0; i< item.studentlist.length; i++){
  //   const studentDetails = await Studencourse.findOne({_id: item.studentlist[i]})
  //   if (!studentDetails) { return res.end(notfoundstring) }
    
  //   students.push(studentDetails);
  // }
  students = await Studencourse.find({courseId: id})

  LOG.info(students);
  return res.render('instructor/viewstudents.ejs',
    {
      title: 'View Students for a course',
      layout: 'layout.ejs',
      instructor: students
    })
})

// POST new

api.get('/openfile',(req, res, next) => {
  let fileName = "uploads/" + req.query.file_name;
  fs.readFile(fileName, (err, FileData) => {
    //res.writeHead(200, {'Content_Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet/xlsx'});
    if(err){
      console.log(err);
    }
    

  res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
    res.writeHead(200, [['Content-Type',  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']]);
    res.end( FileData );

    
  });
});



api.post('/save', async (req, res) => {
  LOG.info(`Handling POST ${req}`)
  LOG.debug(JSON.stringify(req.body))
  const item = new Model()
  LOG.info(`NEW ID ${req.body._id}`)
  console.log('form')
  var formss = new formidable.IncomingForm();
  //formss.uploadDir = "/app/codewords/uploads";
  //formss.keepExtensions = true;
  //formss.maxFieldsSize = 10*1024*1024;
  //formss.multiples = false;
   formss.parse(req, async(err, fields, files) =>  {
    if (err) {
      console.error('Error', err)
      throw err
    }
    
    //   var fileNames = [];
    // fileNames.push(files.path)
      

    //let arr2 = JSON.stringify(files.studentlist)
   // const urlName = arr2.substring(arr2.indexOf("uploads\\")+9, arr2.indexOf("name")-3)
        
    
    console.log('Fields', fields)
    console.log('Files', files)
  item.instructoremail=req.user.email
  item.coursename=fields.coursename
  item.startdate = fields.startdate
  item.enddate = fields.enddate
  item.intiallink= fields.intiallink
  item.finallink= fields.finallink
  item.codewordSetname = fields.codeword
  // item.fileUrl = urlName

  console.log(item)
  if(files){
    console.log(files.name)
  }else{
    console.log('No file found');
  }

   var f = files[Object.keys(files)[0]];
    var wb = XLSX.readFile(f.path);
    const sheetnames = wb.SheetNames;

    var data = XLSX.utils.sheet_to_json(wb.Sheets[sheetnames[0]])

  
  // console.log(wb.Strings);

  // console.log(wb.Strings.Count);
  // console.log(wb.Strings.length);

  // let variable = 2;
  //   while ( variable  <= parseInt(wb.Strings.length)/2) {
  //     console.log(variable);
  //   //  console.log(wb.Strings)
  //    var tempe =  wb.Strings[variable].h;
    
  //     studentEmails.push(tempe);
  //     variable  = variable +1;
  //   }

  //   let variable1 = (parseInt(wb.Strings.length)/2)+1;
  //   while ( variable1  < parseInt(wb.Strings.length)) {
  //     console.log(variable1);
  //   //  console.log(wb.Strings)
  //    let temp = wb.Strings[variable1].t;
    
  //     studentNames.push(temp);
  //     variable1  = variable1 +1;
  //   }

    // for (i = 2; i < parseInt(wb.Strings.length)-1; i++) {
    //   console.log(i);
    // //  console.log(wb.Strings)
    //  var tempe =  wb.Strings[i].t;
    
    //   studentEmails.push(tempe);
      
    // }
    
    // console.log("test");
    // studentEmails.length;
    // console.log(studentEmails);
    // console.log(item.codewordSetname);

   // var codewordset = Codeword.find({codeWordSetName:""item.codewordsetname""});

    var codewordstest=await Codeword.find({ codeWordSetName: item.codewordSetname });
  
    var codewords = codewordstest[0].codewords;
    

    shuffle(data);
    shuffle(codewords);

    // try {
   
    //   await item.save();
    //  // res.send(item);
    // } catch (err) {
    //   res.status(500).send(err);
    // }

    console.log('data',data.length)
    console.log('codewords',codewords.length)

    if(data.length>codewords.length){
      

      return res.status(400).send("Number of codewords is less than students");

    }
  
    console.log("saves");
    console.log(data);
    var studentcoursearray=[];

    for(j=0; j<data.length; j++){
     
    var studentcourse = new Studencourse()
     console.log(j);
    console.log(item._id);
    studentcourse.name = data[j].name;
    studentcourse.studentEmail = data[j].emailid;
    studentcourse.courseId = item._id + "";
    studentcourse.codeword = codewords[j];
    studentcourse.iscodeRevealed = false;


    studentcoursearray.push(studentcourse);


    

    //try {
   
      //console.log("saves");
      //await studentcourse.save();
     // res.send(item);
    //} catch (err) {
      //res.status(500).send(err);
    //}




    }

    Studencourse.collection.insert(studentcoursearray, function (err, docs) {
      if (err){ 
          return console.error(err);
      } else {
        console.log("Multiple documents inserted to Collection");
      }
    });

    var studentcourseIds=[];
    for(let i=0; i < studentcoursearray.length; i++){
          studentcourseIds.push(studentcoursearray[i]._id);
    }

    //item.studentlist = studentcourseIds
    try {
   
      await item.save();
     // res.send(item);
     return res.redirect('/instructor')
    } catch (err) {
      res.status(500).send(err);
    }



  })

  LOG.info(`SAVING NEW instructor ${JSON.stringify(item)}`)
  //return res.redirect('/instructor')
})


function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

function searchByKey(key,arr) {
  for (var i = 0, l = arr.length; i < l; i++){
    if (arr[i].CodeWordSet === key) {
      return arr[i].CodeWords;
    }
  }
  return false;
}

api.post('/distributecodewords/:id', async (req, res) => {

  const id = req.params.id
  console.log('revealing');

  Studencourse.updateMany({"courseId":id},{iscodeRevealed: true},function (err, docs) {
    if (err){ 
        return console.error(err);
    } else {
      res.status(200).send("OK");
      console.log("Multiple documents updated");
    }
  });
});

  api.post('/removestudentfromcourse/:id', async (req, res) => {

    const id = req.params.id

    var findcourse =await Studencourse.find({"_id":id})
    var course = findcourse[0]
    console.log('studentcourse', course)
  
    //Model.update( { "_id": course.courseId }, { $pullAll: { studentlist: course._id } } )

    console.log("val",id);
    Studencourse.remove({"_id":id},function (err, docs) {
      if (err){ 
          return console.error(err);
      } else {
        res.status(200).send("OK");
        console.log("Removed");
      }
    });

  // var studentcourses = await Studencourse.find({"courseId":id})

  // var courses = [];

  // console.log('cousrese',studentcourses)



  // for (var i = 0; i < studentcourses.length; i++) {

  //   var temp1 = new Studencourse()

  //   var temp1 = studentcourses[i]
  //   temp1.iscodeRevealed = true;

  //   courses.push(temp1);




  // }
  // try
  // {
  //   Studencourse.updateMany(courses, function (err, docs) {
  //     if (err){ 
  //         return console.error(err);
  //     } else {
  //       console.log("Multiple documents updated");
  //     }
  //   });

  // }
  // catch (err) {
  //   res.status(500).send(err);
  // }
  
  

  
  //item.unitPrice = parseInt(req.body.unitPrice)
 //s LOG.info(`SAVING UPDATED instructor ${JSON.stringify(item)}`)
 // return res.redirect('/instructor')
})

// POST update
api.post('/save/:id', async (req, res) => {
  LOG.info(`Handling SAVE request ${req}`)
  const id = req.params.id
  LOG.info(`Handling SAVING ID=${id}`)

  const items =  await Model.find({ _id: id })
  console.log(items)
  var item=items[0]
  //item= item[0]
  if (!item) { return res.end(notfoundstring) }
  LOG.info(`ORIGINAL VALUES ${JSON.stringify(item)}`)
  LOG.info(`UPDATED VALUES: ${JSON.stringify(req.body)}`)
  item.coursename = req.body.coursename
  item.startdate = req.body.startdate
  item.enddate = req.body.enddate
  item.intiallink= req.body.intiallink
  item.finallink= req.body.finallink
  //item.studentlist = req.body.studentlist
  item.codewordsetname = req.body.codewordsetname
  try {
   
    await item.save();
   // res.send(item);
  } catch (err) {
    res.status(500).send(err);
  }
  //item.unitPrice = parseInt(req.body.unitPrice)
  LOG.info(`SAVING UPDATED instructor ${JSON.stringify(item)}`)
  return res.redirect('/instructor')
})

function hasRepeatedLetters(str) {
  var patt = /^([a-z])\1+$/;
  var result = patt.test(str);
  return result;
}

api.post('/addCodewords', async (req, res) => {
  console.log(req);
  var formss = new formidable.IncomingForm();
  formss.parse(req, async (err, fields, files) => {
      if (err) {
          console.error('Error', err)
          throw err
      }
      console.log('Fields', fields)
      console.log(req.body)


      //var length = codes.length;
      var name = fields.codewordname;
      var submitType = fields.submittype;
      var codewordsraw = matchKey(fields, "item");;
      console.log('type', submitType);

      
      var f = files[Object.keys(files)[0]];
      if (f) {
        var wb = XLSX.readFile(f.path);
        const sheetnames = wb.SheetNames;
        
        var dataval = XLSX.utils.sheet_to_json(wb.Sheets[sheetnames[0]])
        console.log(dataval);

        for (i = 0; i < dataval.length; i++) {
          console.log(dataval[i].codwords)
          codewordsraw.push(dataval[i].codewords)
      }
      
      }

      var codewords = codewordsraw.filter(function (el) {
          if (el != null && el != "") {
              return true;
          }
          return false;
      });

      if (submitType == 'edit') {
        
          var okk = await Codeword.find({ _id: fields.codewordId })
          console.log('jdkd', okk[0])

          var tempval = okk[0];
          tempval.codeWordSetName = name
          tempval.codewords = codewords
          // console.log('typeee',temps)
          if (hasDuplicates(codewords)) {
            return res.status(400).send("Has Duplicate codewords")
        }

        for(i=0;i<=codewords.length;i++){

          if(hasRepeatedLetters(codewords[0]))
          {
            return res.status(400).send("Has two consicutive same letters")
          }
        }
        

          try {
              //console.log(data);
              await tempval.save();
              return res.redirect('codewords')
              // res.send(item);
          } catch (err) {
              res.status(500).send(err);
          }
      }
      else {
          var temp = await Codeword.find({ codeWordSetName: name })
          console.log('codeword', temp)
          if (temp[0]) {
              if (temp[0].codeWordSetName) {

                  return res.status(400).send("CodeWord with setname already exists")
              }
          }
          if (hasDuplicates(codewords)) {
              return res.status(400).send("Has Duplicate codewords")
          }

          data.codeWordSetName = name
          data.codewords = codewords

          try {
              console.log(data);
              await data.save();
               res.send('success');
              // res.send(item);
          } catch (err) {
              console.log(err);
              res.status(500).send(err);
          }
      }
  })

  const data = new Codeword()
  //var data = {};
  console.log('form')
  console.log(req.body)
  // new formidable.IncomingForm().parse(req, async(err, fields, files) =>  {
  //   if (err) {
  //     console.error('Error', err)
  //     throw err
  //   }

  // var fields = req.body

  //   console.log('codes',fields)
  //  //fields.keys.search("item")

  //  //var codes = Object.values(fields)


  //   //var length = codes.length;
  //   var name = fields.codewordname;
  //   var submitType = fields.submittype;
  //   var codewords =  matchKey(fields, "item");;
  //   console.log('type',submitType);


  //   if(submitType == 'edit'){


  //    var okk = await Codeword.find({ _id:fields.codewordId })
  //    console.log('jdkd',okk[0])

  //    var tempval = okk[0];
  //    tempval.codeWordSetName= name
  //    tempval.codewords=codewords
  //    // console.log('typeee',temps)


  //    try {
  //     //console.log(data);
  //      await tempval.save();
  //      return res.redirect('codewords')
  //     // res.send(item);
  //    } catch (err) {
  //      res.status(500).send(err);
  //    }



  //   }
  //   else{

  //     var temp = await Codeword.find({ codeWordSetName: name})
  //     console.log('codeword',temp)
  //     if(temp[0]){
  //       if(temp[0].codeWordSetName){

  //         return res.status(400).send("CodeWord with setname already exists")
  //       }
  //     }



  //     data.codeWordSetName= name
  //     data.codewords=codewords

  //     try {
  //       console.log(data);
  //        await data.save();
  //        return res.send('success');
  //       // res.send(item);
  //      } catch (err) {
  //        res.status(500).send(err);
  //      }
  //   }
  //})
  // LOG.info(`SAVING NEW e ${JSON.stringify(item)}`)

})

api.get('/codewords',async (req, res) => {

  const data = await Codeword.find({})
  console.log(data);

  

  res.render('instructor/codewords.ejs',{layout:'layout.ejs',val:data})

}) 
// DELETE id (uses HTML5 form method POST)
api.post('/delete/:id', async (req, res) => {
  LOG.info(`Handling DELETE request ${req}`)
  const id = req.params.id
  LOG.info(`Handling REMOVING ID=${id}`)
  const item =await Model.findOne({ _id: id })
  console.log(item)
  if (!item) { return res.end(notfoundstring) }
  if (item.isActive) {
    item.isActive = false
    console.log(`Deacctivated item ${JSON.stringify(item)}`)
  } else {
    const item =await Model.remove( { _id: id })
    console.log(`Permanently deleted item ${JSON.stringify(item)}`)
  }
  return res.redirect('/instructor')
})

api.post('/add-students/:id', async (req, res) => {

  const item = new Studencourse()
  console.info(`NEW ID ${req.body._id}`)

  if (req.body && req.body.name && req.body.studentEmail) {

    item.isRead = false
    item.name = req.body.name
    item.studentEmail = req.body.studentEmail
    item.courseId = req.params.id
    item.codeword = null
    item.iscodeRevealed = false

    var isexistAlready =await Studencourse.find({$and:[{courseId:req.params.id},{studentEmail:req.body.studentEmail}]})
 
    console.log('student',isexistAlready[0])

    if(isexistAlready[0]){
      return res.status(400).send("student with email already present");
    }

    else{
      item.save((err) => {
        if (err) {
          return res.end('ERROR: item could not be saved ' + err.message)
        }
        LOG.info(`SAVING NEW item ${JSON.stringify(item)}`)
        return res.send({
          status: 200,
          message: "student added successfully"
        });
        // return res.redirect('/instructor/viewstudents/5dd6d9bd445f8d0017d7d374')
      })
    }
   
  } else {
    return res.status(400).send("missing required fields name or email");
  }

});

module.exports = api
  