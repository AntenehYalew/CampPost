require('dotenv').config();

const express         = require("express"),
     router           =  express.Router({mergeParams:true}),
      comment         = require("../models/commentmodel"),
      campbookpost    = require("../models/campbookpostmodel"),
      formidable      = require("formidable"),
      methodOverride  = require("method-override"),
      path            = require("path"), 
      cloudinary      = require ("cloudinary").v2,
      bodyparser      = require("body-parser"),
      commentRoutes   = require("../routes/comments"),
      middleware     = require("../middleware"),
      unirest         = require("unirest");
const { promisify }   = require('util');

router.use(methodOverride("_method"));


//Google API Config
const googleMapsClient = require('@google/maps').createClient({
    key: process.env.GOOGLE_KEY
  });


//Coudinary Config
  cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET 
  });

  const uploadAsync = promisify(cloudinary.uploader.upload.bind(cloudinary.uploader)) 



  //All Routes


router.get("/", (req,res)=>{
    campbookpost.find({}).sort({createdAt:-1}).populate("comment").exec((err,allcbcg)=>{
        if(!err && (allcbcg.length > 0)){
            campbookpost.find({}).sort({avgRating:-1}).populate("comment").exec((err,toprated)=>{
                if(!err){ 
            
                res.render("campbook/index",{allcbcg:allcbcg,toprated:toprated})
                }else{
                    console.log(err)
                } 
            })
        }else{
            res.send("Error dude")
            console.log(err)
        }
    })
})

router.get("/newcampbook", middleware.isLoggedIn, (req,res)=>{
    res.render("campbook/newcampbook")
})


router.post("/newcampbook",middleware.isLoggedIn,(req,res)=>{
new formidable.IncomingForm({ multiples: true }).parse(req,  (err,fields,file)=>{
     campbookpost.create(fields,(err,newCampPost)=>{
        if(!err){ 
            campbookpost.findById(newCampPost._id, async (err,FoundPost)=>{ 
                 if(!err){ 
                    var pathArray = [];
                    if (Array.isArray(file.image) != true && file.image.name) {
                        pathArray.push(file.image.path)
                    }else if(Array.isArray(file.image) ===true){
                        file.image.forEach(e =>{
                            pathArray.push(e.path)
                        })
                    }else{
                       res.send("No Files Found")
                    }
                     for(let e of pathArray){
                        const { secure_url, public_id} = await uploadAsync(e)
                        const imageValues = {
                            publicIds:public_id,
                            imageUrl:secure_url,
                        }
                        FoundPost.avgRating = fields.rating;
                        FoundPost.images.push(imageValues);
                        FoundPost.save();
                      }
                      res.redirect("/") 
                 }else{
                    console.log("///////////")
                    res.send(err)
                } 
             }) 
        }else{
            console.log(err)
        }
    }) 
})
})


router.get("/showcampbook/:postId",(req,res)=>{

    campbookpost.findById(req.params.postId).populate("comment").exec((err,selectedPost)=>{
        if(!err){
            var totalRating = selectedPost.rating;
            for(var i =0; i<selectedPost.comment.length; i++){
                totalRating += selectedPost.comment[i].postRating
            }
            avgRating = totalRating /((selectedPost.comment.length) + 1)
            selectedPost.avgRating = avgRating;
            selectedPost.save();
            googleMapsClient.geocode({
                address: selectedPost.geoAddress
              }, function(err, response) {
                if (!err) {
                    const latlng =response.json.results[0].geometry.location;
                    const latlngLng = latlng.lng
                    const latlngLat = latlng.lat

                
                var weatherReq = unirest("GET", "https://weatherbit-v1-mashape.p.rapidapi.com/current");

                weatherReq.headers({
                    "x-rapidapi-host": process.env.X_RAPIDAPI_HOST,
                    "x-rapidapi-key": process.env.X_RAPIDAPI_KEY
                });

                weatherQuery = {
                    "units": "I",
                    "lang": "en",
                    "lon": latlngLng,
                     "lat": latlngLat
                }
                weatherReq.query(weatherQuery);
               
               weatherReq.end(function (weatherResult) {
                 if (weatherResult.error) throw new Error(weatherResult.error);

                 const weatherData = weatherResult.body.data[0].weather;
                 weatherData.temp = weatherResult.body.data[0].temp;
                 weatherData.city_name = weatherResult.body.data[0].city_name;
                 var newsReq = unirest("GET", "https://microsoft-azure-bing-news-search-v1.p.rapidapi.com/");

                 newsReq.headers({
                 "x-rapidapi-host": "microsoft-azure-bing-news-search-v1.p.rapidapi.com",
                 "x-rapidapi-key": "3e2ff4b961mshee6a65ea5936e7bp167b7ejsn34caaf6fdfeb"
                 });
                 
                 var topFiveNews = []
                 newsReq.end(function (newsResult) {
                    if (newsResult.error) throw new Error(newsResult.error);
                    var x = Math.floor((Math.random() * 7))
                    for(var i = x; i<x+3; i++){
                     topFiveNews.push(newsResult.body.value[i])
                    }
                    res.render("campbook/showcampbook",{selectedPost:selectedPost,latlng:latlng,weatherData:weatherData,topFiveNews:topFiveNews})
                });
                 });
                 
           
                }else{
                res.render("campbook/showcampbook",{selectedPost:selectedPost})
                }
              });
        } else{
            console.log(err)
            res.render("Error")
        } 
    })
})

router.get("/updatecamppost/:postId", middleware.checkCampPostOwnership,(req,res)=>{
    campbookpost.findById(req.params.postId , (err,selectedPost)=>{
        res.render("campbook/updatecampbook", {selectedPost:selectedPost})
    })
})

router.put("/updatecamppost/:postId", middleware.checkCampPostOwnership, (req,res)=>{
    new formidable.IncomingForm({ multiples: true }).parse(req,  (err,fields,file)=>{
         if(Array.isArray(file.image) != true && !file.image.name){
            campbookpost.findByIdAndUpdate(req.params.postId, fields, async (err,updatedPost)=>{
                res.redirect("/showcampbook/"+req.params.postId)
            })
        }else{
         campbookpost.findByIdAndUpdate(req.params.postId, fields, async (err,updatedPost)=>{
            if(!err){
                 var pathArray = [];
               if(!file.image.length){
                    pathArray.push(file.image.path)
                }else{
                    file.image.forEach(e =>{
                        pathArray.push(e.path)
                    })
                }
               
                for(let e of pathArray){
                    const { secure_url, public_id} = await uploadAsync(e)
                    const imageValues = {
                        publicIds:public_id,
                        imageUrl:secure_url,
                    }
                    updatedPost.images.push(imageValues);
                    updatedPost.save();
                  } 
                  res.redirect("/showcampbook/"+req.params.postId)
            } 
        })
    }  
    })
})

router.delete("/updatecamppost/:postId/:imageId", middleware.checkCampPostOwnership,(req,res)=>{

    campbookpost.findByIdAndUpdate(req.params.postId, {$pull: {"images":{"_id":req.params.imageId}}},{multi:true}, (err)=>{
        if(!err){
           res.redirect("/updatecamppost/"+req.params.postId)
        }
    })
})

router.delete("/deletecamppost/:postId",middleware.checkCampPostOwnership, (req,res)=>{
    campbookpost.findByIdAndRemove(req.params.postId, (err)=>{
        if (!err){
            console.log("Post Deleted")
            res.redirect("/")
        }
    })
})



module.exports = router