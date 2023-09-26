const express = require("express");
const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");
// const reviewController = require("../controllers/reviewController");
const reviewRouter = require("../routes/reviewRoutes");

const router = express.Router();

router.route("/tour-stats").get(tourController.getTourStats);

router
    .route("/top-5-cheap")
    .get(tourController.aliasTopTours, tourController.getAllTour);

router
    .route("/monthly-plan/:year")
    .get(
        authController.protect,
        authController.restrictTo("admin", "lead-guide", "guide"),
        tourController.getMonthlyPlan
    );

router
    .route("/tours-within/:distance/center/:latlng/unit/:unit")
    .get(tourController.getTourWithin);

router.route("/distances/:latlng/unit/:unit").get(tourController.getDistance);

router
    .route("/")
    .get(tourController.getAllTour)
    .post(
        authController.protect,
        authController.restrictTo("admin", "lead-guide"),
        tourController.createTour
    );

router
    .route("/:id")
    .get(tourController.getTour)
    .patch(
        authController.protect,
        authController.restrictTo("admin", "lead-guide"),
        tourController.updateTour
    )
    .delete(
        authController.protect,
        authController.restrictTo("admin", "lead-guide"),
        tourController.deleteTour
    );

// router
//     .route("/:tourId/reviews")
//     .post(
//         authController.protect,
//         authController.restrictTo("user"),
//         reviewController.createReview
//     );

router.use("/:tourId/reviews", reviewRouter);

module.exports = router;
