const Listing = require('../models/listing.js');
const Review = require("../models/review.js");

module.exports.postReview = async (req, res) => {
    let{id} = req.params;
    let newReview = new Review(req.body.review);
    let listing = await Listing.findById(id);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();
    req.flash("success", "New Review added!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate (id, {$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
};