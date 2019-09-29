
module.exports = {
  ensureAuthenticated: function(req, res, next) {
  //  console.log(req)
    if (req.isAuthenticated()) {
      return next();
    }

    

    //req.flash('error_msg', 'Please log in to view that resource');
   // req.session.save(function () {
      res.redirect('/users/login');
    //});
    // 
   
  },
  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('/dashboard');      
  }
};
