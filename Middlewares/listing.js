const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");

//check for owner middleware
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
        let listing = await Listing.findById(id);
        if(!listing.owner._id.equals(res.locals.currUser._id)){
            req.flash("error", "You are not the owner of this listing.")
            return res.redirect(`/listings/${id}`);
        }
        next();
}

//Validte listing middleware
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}
