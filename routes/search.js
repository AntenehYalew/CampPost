const express         = require("express"),
     router           =  express.Router({mergeParams:true}),
      mongoose        = require("mongoose"),
      comment         = require("../models/commentmodel"),
      campbookpost    = require("../models/campbookpostmodel"),
      camppostRoutes  = require("../routes/camppost"),
      commentRoutes   = require("../routes/comments"),
      bodyparser      = require("body-parser");

      router.use(bodyparser.urlencoded({extended:true}));


router.post("/search", (req,res)=>{
     var searchValue = req.body.search;
     campbookpost.find({geoAddress:{$regex:searchValue}}, (err,searchResults)=>{
       if(!err){

           res.render("campbook/search",{searchResults:searchResults,searchValue:searchValue})
       }else{
           console.log(err)
       }
   })
    
})

router.get("/showallcampbooks/:dozens", (req,res)=>{
    var dozens = parseInt(req.params.dozens);
    campbookpost.find({}).sort({createdAt:-1}).skip(dozens).limit(12).populate("comment").exec((err,allPosts)=>{
        if(!err){
            res.render("campbook/allcampbooks",{allPosts:allPosts,dozens:dozens})
        }else{
            console.log(err)
        }
    })
})


module.exports = router