const express = require("express");
const { check } = require("express-validator");
const {
  createListing,
  getListings,
  getListing,
  updateListing,
  deleteListing,
  getHostListings,
} = require("../controllers/listingController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Validation middleware
const listingValidation = [
  check("title", "Title is required").not().isEmpty().trim(),
  check("description", "Description is required").not().isEmpty().trim(),
  check("location.address", "Address is required").not().isEmpty().trim(),
  check("location.city", "City is required").not().isEmpty().trim(),
  check("location.state", "State is required").not().isEmpty().trim(),
  check("location.country", "Country is required").not().isEmpty().trim(),
  check("location.coordinates.lat", "Latitude is required and must be a number")
    .notEmpty()
    .isFloat({ min: -90, max: 90 }),
  check("location.coordinates.lng", "Longitude is required and must be a number")
    .notEmpty()
    .isFloat({ min: -180, max: 180 }),
  check("price.base", "Base price is required and must be a positive number")
    .notEmpty()
    .isFloat({ min: 0 }),
  check("propertyType", "Property type is required")
    .notEmpty()
    .isIn(["apartment", "house", "villa", "condo", "studio"]),
  check("roomType", "Room type is required")
    .notEmpty()
    .isIn(["entire", "private", "shared"]),
  check("maxGuests", "Maximum guests is required and must be a positive number")
    .notEmpty()
    .isInt({ min: 1 }),
  check("bedrooms", "Number of bedrooms is required and must be a non-negative number")
    .notEmpty()
    .isInt({ min: 0 }),
  check("beds", "Number of beds is required and must be a positive number")
    .notEmpty()
    .isInt({ min: 1 }),
  check("bathrooms", "Number of bathrooms is required and must be a positive number")
    .notEmpty()
    .isFloat({ min: 1 }),
];

// Public routes
router.get("/", getListings);
router.get("/:id", getListing);

// Protected routes
router.use(protect);

// Host routes
router.get("/host/my-listings", authorize("host", "admin"), getHostListings);
router.post("/", authorize("host", "admin"), listingValidation, createListing);
router.put(
  "/:id",
  authorize("host", "admin"),
  listingValidation,
  updateListing
);
router.delete("/:id", authorize("host", "admin"), deleteListing);

module.exports = router;
