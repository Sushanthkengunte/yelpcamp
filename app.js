var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    Campground = require("./models/campgrounds"),
    seedDB = require("./seed"),
    Comment = require("./models/comment"),
    mongoose = require("mongoose");
    
mongoose.connect("mongodb://localhost/yelp_camp");
seedDB();
app.use(express.static(__dirname+"/public"));

// Scema Setup




// Campground.create( {
//                 name:"Spiti Valley",
//                 url: "http://www.spitiholidayadventure.com/storage/5970aa504f376.jpg",
//                 description: "This is a description of the camp ground which is displayed with all the details regarding the camp ground"
//             },
//             function(err,campground){
//                 if(err){
//                     console.log("Something went wrong");
//                     console.log(err);
//                 }else{
//                     console.log("Added campground");
//                     console.log(campground);
//                 }
    
// });
//   var campGrounds = [
            
//             {
//                 name:"Rishikesh",
//                 url: "https://upload.wikimedia.org/wikipedia/commons/c/c9/A_camp_site_by_the_Ganga%2C_Rishikesh.jpg"
//             },
            
//               {
//                 name:"Spiti Valley",
//                 url: "http://www.spitiholidayadventure.com/storage/5970aa504f376.jpg"
//             },
        
//             {
//                 name:"Jaisalmer, Rajasthan",
//                 url: "https://d2gg9evh47fn9z.cloudfront.net/800px_COLOURBOX6429232.jpg"
//             },
//           {
//                 name:"Chandertal Lake – Himachal Pradesh",
//                 url: "https://media-cdn.tripadvisor.com/media/photo-s/09/96/2a/90/chandertal-lake.jpg"
//             },
//           {
//                 name:"Manali Solang Valley – Himachal Pradesh.",
//                 url: "https://www.tourmyindia.com/images/solang-valley4.jpg"
//             },
        
//           {
//                 name:"Mussoorie, Uttarakhand",
//                 url: "http://eragenx.com/wp-content/uploads/2016/08/Mussoorie.jpg"
//             },
        
//           {
//                 name:"Pushkar, Rajasthan",
//                 url: "http://4.bp.blogspot.com/-JE4ElFpW3k8/UmJeAzR--OI/AAAAAAAAD4I/rSlXap2MhoA/s1600/rajasthan-pushkar_lake.jpg"
//             },
//           {
//                 name:"Sonamarg, Jammu and Kashmir",
//                 url: "http://www.indialine.com/travel/images/sonmarg.jpg"
//             },
//           {
//                 name:"Kaudiyala – Uttaranchal",
//                 url: "http://www.indiawaterportal.org/sites/indiawaterportal.org/files/styles/node_lead_image_new/public/6172023818_988b81c090_b_2.jpg?itok=oYQXiRlA"
//             }
        
        
        
//         ];

app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine","ejs");


app.get("/",function(req,res){
   res.render("landing");
   
});
//Index - Displays all the campgrounds
app.get("/campgrounds",function(req,res){
    
  Campground.find({},function(err,allCampgrounds){
      if(err){
          console.log(err);
      }else{
        res.render("campgrounds/index",{campGrounds:allCampgrounds});      
      }
  });
    
    
});

//CREATE - Adds new campground to db
app.post("/campgrounds",function(req,res){
   
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
app.get("/campgrounds/new",function(req, res) {
   res.render("campgrounds/new"); 
});
// SHOW - 
app.get("/campgrounds/:id",function(req, res) {
    // console.log(req.params.id);
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log("Wrong");
        }else{
            
            res.render("campgrounds/show",{campground:foundCampground});
        }
    })
    
   
});

app.get("/campgrounds/:id/comments/new",function(req, res) {
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{campground:campground});
        }
    });
   
});

app.post("/campgrounds/:id/comments",function(req,res){
   Campground.findById(req.params.id,function(err, campground) {
     if (err){
         console.log(err);
         res.redirect("/campgrounds");
     }  else{
         Comment.create(req.body.comment,function(err,comment){
            if(err){
                console.log(err);
            } else{
                campground.comments.push(comment);
                campground.save();
                res.redirect("/campgrounds/"+campground._id)
            }
         });
     }
   });
});

app.listen(process.env.PORT,process.env.IP,function(){
    
   console.log("Start Camping!!"); 
});