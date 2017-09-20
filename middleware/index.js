var Comment = require("../models/comment");
var Campground = require("../models/campground");
module.exports = {
  isLoggedIn: function(req, res, next){
      if(req.isAuthenticated()){
          return next();
      }
      req.flash("error", "You must be signed in to do that!");
      res.redirect("/login");
  },
  checkUserCampground: function(req, res, next){
      if(req.isAuthenticated()){
          Campground.findById(req.params.id, function(err, campground){
             if(campground.author.id.equals(req.user._id) || req.user.isAdmin){
                 next();
             } else {
                 req.flash("error", "You don't have permission to do that!");
                 console.log("BADD!!!");
                 res.redirect("/campgrounds/" + req.params.id);
             }
          });
      } else {
          req.flash("error", "You need to be signed in to do that!");
          res.redirect("/login");
      }
  },
  checkUserComment: function(req, res, next){
      if(req.isAuthenticated()){
          Comment.findById(req.params.commentId, function(err, comment){
             if(comment.author.id.equals(req.user._id) || req.user.isAdmin){
                 next();
             } else {
                 req.flash("error", "You don't have permission to do that!");
                 res.redirect("/campgrounds/" + req.params.id);
             }
          });
      } else {
          req.flash("error", "You need to be signed in to do that!");
          res.redirect("login");
      }
  },
  isAdmin: function(req, res, next) {
    if(req.user.isAdmin) {
      next();
    } else {
      req.flash("error", "This site is now read only thanks to spam and trolls.");
      res.redirect("back");
    }
  },
  isSafe: function(req, res, next) {
    if(req.body.image.match(/^https:\/\/images\.unsplash\.com\/.*/)) {
      next();
    }else {
      req.flash("error", "Only images from images.unsplash.com allowed.\nSee https://youtu.be/Bn3weNRQRDE for how to copy image urls from unsplash.");
      res.redirect("back");
    }
  }
}