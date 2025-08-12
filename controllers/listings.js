const Listing=require("../models/listing");



module.exports.index=async (req,res)=>{
    const alllistings=await Listing.find({});
    res.render("index.ejs",{alllistings});
};


module.exports.renderNewForm=(req,res)=>{
    res.render("new.ejs");
};

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!listing){
      req.flash("error","Listing you requested for does not exist");
       res.redirect("/listing");
    }
    res.render("show.ejs",{listing});
};

module.exports.createListing=async (req,res,next) =>{
    let listings=new Listing(req.body.listings);
    listings.owner=req.user._id;
    await listings.save(); 
    req.flash("success","New Listing Created!.");
    res.redirect("/listing");
  };

  module.exports.renderEditForm=async (req,res)=>{
      let {id}=req.params;
      const listing=await Listing.findById(id);
      res.render("edit.ejs",{listing});
  };

  module.exports.updateListing=async (req,res)=>{
     console.log("Received body:", req.body);
     let {id}=req.params;
      await Listing.findByIdAndUpdate(id, { ...req.body.listings});
      req.flash("success","Updated Listing!.");
      res.redirect(`/listing/${id}`);
  };

  module.exports.deleteListing=async(req,res)=>{
      let {id}=req.params;
      let deleteListing=await Listing.findByIdAndDelete(id);
      req.flash("success"," Listing Deleted!.");
      res.redirect("/listing");
  };