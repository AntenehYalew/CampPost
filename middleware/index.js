// All middlewares goes here

  const  campbookpost    = require("../models/campbookpostmodel");
  const  comment    = require("../models/commentmodel");

var middlewareObj = {

};

middlewareObj.checkCampPostOwnership =function(req,res, next){
    if(req.isAuthenticated()){
        campbookpost.findById(req.params.postId, (err,selectedId)=>{
            if(err){
               /*  req.flash("error", " Unable to find the campground!!") */
                res.redirect("/showcampbook/"+req.params.postId)
            }else{
                    if(req.user._id.equals(selectedId.postOwnerId)){
                    next();
                }else{
          /*           req.flash("error", " You do not have permission!!") */
                  res.redirect("/showcampbook/"+req.params.postId)
                }
            }
        })
    } else{
        const originalUrl =req.originalUrl
/*         req.flash("error", "You need to be logged in!!!"); */
        res.render("usermgt/login",{originalUrl:originalUrl});
    }
    
};


middlewareObj.checkCommentOwnership =function(req,res,next){
    if(req.isAuthenticated()){
        comment.findById(req.params.commentId, (err,selectedcommentId)=>{
            if(err){
               /*  req.flash("error","Unable to find the CampPost!!"); */
               res.redirect("/showcampbook/"+req.params.postId)
            }else{
                   if(req.user._id.equals(selectedcommentId.commentAuthorId)){
                   next();
                }else{
              /*       req.flash("error", "Only owners can comment") */
                  res.redirect("/showcampbook/"+req.params.postId+"/comment/"+req.params.commentId)
                }
              
            }
        })
    } else{
        const originalUrl =req.originalUrl
      /*   req.flash("error", "You need to be logged in!!!") */
        res.render("usermgt/login",{originalUrl:originalUrl});
    }
};



middlewareObj.isLoggedIn =function(req,res,next){
    if(req.isAuthenticated()){
        return next()
    } else{
       /*  req.flash("error", "You need to be logged in!!!"); */
        var originalUrl =req.originalUrl;
        res.render("usermgt/login",{originalUrl:originalUrl, message:"You need to be logged in!!!"});
    }
};


module.exports = middlewareObj