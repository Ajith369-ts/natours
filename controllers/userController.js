const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const factory = require("../controllers/handlerFactory");

exports.getAllUsers = catchAsync(async (req, res) => {
    const users = await User.find();

    res.status(200).json({
        status: "success",
        results: users.length,
        data: {
            users,
        },
    });
});

const filterObj = (obj, ...allowedField) => {
    const newObj = {};

    Object.keys(obj).forEach((el) => {
        if (allowedField.includes(el)) {
            newObj[el] = obj[el];
        }
    });

    return newObj;
};

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
    // create error if user post password daa
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                "This route is not for password updates. Please use /updatePassword."
            )
        );
    }

    const filterBody = filterObj(req.body, "name", "email");
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: "success",
        data: {
            user: updatedUser,
        },
    });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, {
        active: false,
    });

    res.status(204).json({
        status: "success",
        data: null,
    });
});

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
