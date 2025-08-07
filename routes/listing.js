const express=require("express");
const router=express.Router();
const Listing = require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validatelisting}=require("../middleware.js");


// Index Route
router.get("/",wrapAsync(async (req,res)=>{
    const alllistings=await Listing.find({});
    res.render("index.ejs",{alllistings});
}));

// New Route
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("new.ejs");
});

// Show Route
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!listing){
      req.flash("error","Listing you requested for does not exist");
       res.redirect("/listing");
    }
    res.render("show.ejs",{listing});
}));

// Create Route
router.post("/",isLoggedIn,validatelisting,wrapAsync(async (req,res,next) =>{
    let listings=new Listing(req.body.listings);
    listings.owner=req.user._id;
    await listings.save(); 
    req.flash("success","New Listing Created!.");
    res.redirect("/listing");
  }));

//edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("edit.ejs",{listing});
}));

// update route
router.put("/:id",isLoggedIn,isOwner,validatelisting,wrapAsync(async (req,res)=>{
   console.log("Received body:", req.body);
   let {id}=req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listings});
    req.flash("success","Updated Listing!.");
    res.redirect(`/listing/${id}`);
}));

// Delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deleteListing=await Listing.findByIdAndDelete(id);
    req.flash("success"," Listing Deleted!.");
    res.redirect("/listing");
}));


module.exports=router;