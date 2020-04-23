const express         = require("express"),
     router           =  express.Router({mergeParams:true}),
      mongoose        = require("mongoose"),
      methodOverride  = require("method-override"),
      comment         = require("../models/commentmodel"),
      campbookpost    = require("../models/campbookpostmodel"),
      camppostRoutes  = require("../routes/camppost"),
      middleware     = require("../middleware"),
      bodyparser      = require("body-parser");


      router.use(methodOverride("_method"));
      router.use(bodyparser.urlencoded({extended:true}));

router.get("/showcampbook/:postId/newcomment", middleware.isLoggedIn, (req,res)=>{
    res.render("campbook/newcomment",{postId: req.params.postId})
})

router.post("/showcampbook/:postId/newcomment", middleware.isLoggedIn,(req,res)=>{
    campbookpost.findById(req.params.postId, (err,postforComment)=>{
        if(!err){
            comment.create(req.body ,(err,newComment)=>{
                if(!err){
                    postforComment.comment.push(newComment._id)
                    postforComment.save();
                setTimeout(function(){
                    res.redirect("/showcampbook/"+req.params.postId)
                },1500)        
                }
            })
           
        }
    })
   
})


router.get("/showcampbook/:postId/comment/:commentId/update", middleware.checkCommentOwnership, (req,res)=>{
    campbookpost.findById(req.params.postId, (err,foundPost)=>{
        if(!err){
            comment.findById(req.params.commentId, (err,selectedComment)=>{
                if(!err){
                    res.render("campbook/updatecomment", {selectedComment:selectedComment,foundPost:foundPost})
                }
            })
        }
    })

})

router.put("/showcampbook/:postId/comment/:commentId",middleware.checkCommentOwnership,(req,res)=>{
    comment.findByIdAndUpdate(req.params.commentId, req.body, (err)=>{
        if(!err){
            res.redirect("/showcampbook/"+req.params.postId)
        }
    } )
})

router.delete("/showcampbook/:postId/comment/:commentId",middleware.checkCommentOwnership,(req,res)=>{
    comment.findByIdAndRemove(req.params.commentId, (err)=>{
        if(!err){
            res.redirect("/showcampbook/"+req.params.postId)
        }
    } )
})


module.exports = router