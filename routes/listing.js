const express = require("express");
const router = express.Router();
const multer  = require('multer');
const {storage} = require('../cloudConfig.js');
const upload = multer({ storage });
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js");
const { isOwner, validateListing } = require("../Middlewares/listing.js");
const listingController = require("../controllers/listings.js");
const Listing = require('../models/listing.js');
router
  .route("/")
  .get(wrapAsync(listingController.getAllListings))
  .post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.postNewListing)
  );

router.get("/new", isLoggedIn, listingController.renderNewForm);

router.get("/search", async(req, res) => {
  let query = req.query.q;
  const allListings = await Listing.find({
    $or: [
      { location: { $regex: new RegExp(query, 'i') } },
      { country: { $regex: new RegExp(query, 'i') } },
      { title: { $regex: new RegExp(query, 'i') } },
      { category: { $regex: new RegExp(query, 'i') } },
    ],
  });
  console.log(allListings);
  if(allListings.length == 0){
    req.flash("error", "Could not find the desired listings");
    return res.redirect("/listings");
  }
    res.render("./listings/index.ejs", { allListings });
})
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.editListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditListingForm)
);

module.exports = router;
