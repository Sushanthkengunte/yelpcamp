var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");

//Index - Displays all the campgrounds
router.get("/",function(req,res){
   
  Campground.find({},function(err,allCampgrounds){
      if(err){
          console.log(err);
      }else{
        res.render("campgrounds/index",{campGrounds:allCampgrounds,currentUser:req.user});      
      }
  });
    
    
});

//CREATE - Adds new campground to db
router.post("/",function(req,res){
   
   var name = req.body.name;
   var image = req.body.url;
   var desc = req.body.description;
//   console.log(image);
   var newCampGround = {name:name,url:image,description:desc};
//   campGrounds.push(newCampGround);
Campground.create(newCampGround,function(err,campground){
    if(err){
        console.log(err);
    }else{
       res.redirect("/campgrounds") 
    }
});
   
    
});
// NEW - Displays a form to make a new campground
router.get("/new",function(req, res) {
   res.render("campgrounds/new"); 
});
// SHOW - 
router.get("/:id",function(req, res) {
    // console.log(req.params.id);
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log("Wrong");
        }else{
            
            res.render("campgrounds/show",{campground:foundCampground});
        }
    })
    
   
});

module.exports = router;
