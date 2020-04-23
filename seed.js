const express         = require("express"),
      mongoose        = require("mongoose"),
 
      comment         = require("./models/commentmodel"),
      campbookpost    = require("./models/campbookpostmodel"),
      User            = require("./models/usermgt"),
      camppostRoutes  = require("./routes/camppost"),
      commentRoutes   = require("./routes/comments"),
      userRoutes      = require("./routes/user"),
      formidable      = require("formidable"),
      path            = require("path"), 
      cloudinary      = require ("cloudinary").v2;
     


function seedStartFresh(){
    campbookpost.remove({}, (err)=>{
        if(!err){
            console.log("All Posts Deleted")
        }
        }) 
        User.remove({}, (err)=>{
        if(!err){
            console.log("All Users Deleted")
        }
        }) 
        
          comment.remove({}, (err)=>{
        if(!err){
            console.log("All Comments Deleted")
        }
        }) 
        
         cloudinary.api.delete_all_resources({resource_type: 'image'}, (err)=>{
            if(!err){
                console.log("All Images Deleted")
            }
        });  
}


module.exports = seedStartFresh;