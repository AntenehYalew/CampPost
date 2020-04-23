require('dotenv').config();


//all requires
const express         = require("express"),
      mongoose        = require("mongoose"),
      ejs             = require("ejs"), 
      methodOverride  = require("method-override"),
      comment         = require("./models/commentmodel"),
      campbookpost    = require("./models/campbookpostmodel"),
      User            = require("./models/usermgt"),
      camppostRoutes  = require("./routes/camppost"),
      commentRoutes   = require("./routes/comments"),
      userRoutes      = require("./routes/user"),
      formidable      = require("formidable"),
      path            = require("path"), 
      cloudinary      = require ("cloudinary").v2,
      flash           = require("connect-flash"),
      LocalStrategy   = require("passport-local"),
      session         = require("express-session"),
      middleware      = require("./middleware"),
      bodyparser      = require("body-parser"),
      passport        = require("passport"),
      seedDB          = require("./seed");

  
      unirest         = require("unirest");
const { promisify }   = require('util');


/* seedDB(); */

const app = express();

//all enviroments
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(flash());
//User Mgt

app.use(session({
    secret: process.env.LOCAL_SECRET,
    resave: false,
    saveUninitialized:true,
    cookie: {secure:false}
}))




app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use (function(req,res, next){
    res.locals.loggedinUser = req.user;
/*     res.locals.error = req.flash("error");
    res.locals.success = req.flash("success"); */
    next();
})


//Middleware to all app functions // To check if a user logged in or not.
// Passes to all Ejs docs\





app.use(camppostRoutes);
app.use(commentRoutes);
app.use(userRoutes);




//DB setting 


mongoose.Promise=global.Promise;

mongoose.connect("mongodb+srv://APPesha:Anteneh@816402@appesha-rptjg.mongodb.net/campbook?retryWrites=true&w=majority",{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true, useFindAndModify: false}).then(()=>{
    console.log("Connected to the DB")
}).catch((err)=>{
    console.log(err.message)
})

//Search Route

app.post("/search", (req,res)=>{
    var searchValue = req.body.search;
 
   campbookpost.find({geoAddress:{$regex:searchValue}}, (err,searchResults)=>{
       if(!err){

           res.render("campbook/search",{searchResults:searchResults,searchValue:searchValue})
       }else{
           console.log(err)
       }
   })
    
})

app.get("/showallcampbooks/:dozens", (req,res)=>{
    var dozens = parseInt(req.params.dozens);
    campbookpost.find({}).sort({createdAt:-1}).skip(dozens).limit(12).populate("comment").exec((err,allPosts)=>{
        if(!err){
            res.render("campbook/allcampbooks",{allPosts:allPosts,dozens:dozens})
        }else{
            console.log(err)
        }
    })
})



app.listen(process.env.PORT || "3000",()=>{
    console.log("Connected to Server")
})
