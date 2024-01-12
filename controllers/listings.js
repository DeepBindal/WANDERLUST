const Listing = require("../models/listing.js");
const mbxGeocoding= require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken : mapToken});
module.exports.getAllListings = async (req, res, next) => {
    const allListings = await Listing.find({});
    // res.send(allListings);
    res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm =  (req, res) => {
    res.render("./listings/new.ejs");
};

module.exports.postNewListing = async (req, res, next) => {
    let coordinates = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
    .send()
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new Listing(req.body.listing);
    newListing.image = {url, filename};
    newListing.owner = req.user._id;
    console.log(coordinates.body.features[0].geometry);
    newListing.geometry = coordinates.body.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing created!");
    res.redirect("/listings");
};

module.exports.showListing =  async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { listing });
};


module.exports.renderEditListingForm = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing does not exist!");
        return res.redirect("/listings");
    } 
    let originalUrl = listing.image.url;
    originalUrl = originalUrl.replace("/upload", "/upload/w_300");
    res.render("./listings/edit.ejs", { listing , originalUrl});
};

module.exports.editListing = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof(req.file) !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res, next) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
};
