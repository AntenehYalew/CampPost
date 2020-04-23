const express  =  require ("express"),
router        =  express.Router(),
passport      = require("passport"),
bodyparser      = require("body-parser"),
User          = require("../models/usermgt");
middleware     = require("../middleware"),
router.use(bodyparser.urlencoded({extended:true}));

router.get("/login", (req,res)=>{
    var originalUrl = "/";
    res.render("usermgt/login",{originalUrl:originalUrl})
})

router.post("/login", passport.authenticate("local",
    {/* successRedirect: "/" + req.body.originalUrl, */
    failureRedirect: "/login",     
    }),  (req,res)=>{
        res.redirect(req.body.originalUrl)
    /* console.log(successRedirect);
    console.log(failureRedirect); */
})



router.get("/signup", (req,res)=>{
    res.render("usermgt/signup")
})

router.post("/signup", (req,res)=>{
    User.register({username: req.body.username , active:false}, req.body.password, (err, newUser)=>{
        if(!err){
            passport.authenticate("local")(req,res, ()=>{
                res.redirect("/")
            })
        }
    })
})

router.get('/logout', function(req, res){
    req.logout();
    res.redirect("/");
  });


module.exports = router