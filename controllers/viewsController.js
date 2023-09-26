const Tour = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.alerts = (req, res, next) => {
    const { alert } = req.query;
    if (alert === "booking")
        res.locals.alert =
            "Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up here immediatly, please come back later.";
    next();
};

exports.getOverview = catchAsync(async (req, res, next) => {
    // get all data
    const tours = await Tour.find();

    res.status(200).render("overview", {
        title: "All Tours",
        tours,
    });
});

exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: "reviews",
        fields: "review rating user",
    });

    if (!tour) {
        return next(new AppError("There is no tour with that name.", 404));
    }

    res.status(200).render("tour", {
        title: `${tour.name} Tour`,
        tour,
    });
});

exports.getLoginForm = (req, res, next) => {
    res.status(200).render("login", {
        title: "Login",
    });
};

exports.getAccount = (req, res) => {
    res.status(200).render("account", {
        title: "Your account",
    });
};
