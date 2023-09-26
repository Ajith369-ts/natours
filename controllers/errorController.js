const AppError = require("../utils/appError");

const sendErrorDev = (err, req, res) => {
    if (req.originalUrl.startsWith("/api")) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    }

    return res.status(err.statusCode).render("error", {
        title: "Something went wrong!",
        msg: err.message,
    });
};

const sendErrorProd = (err, req, res) => {
    if (req.originalUrl.startsWith("/api")) {
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        }

        return res.status(500).json({
            status: "error",
            message: "Something went very wrong!",
        });
    }

    if (err.isOperational) {
        return res.status(err.statusCode).render("error", {
            title: "Something went wrong!",
            msg: err.message,
        });
    }

    return res.status(err.statusCode).render("error", {
        title: "Something went wrong!",
        msg: "Please try again later.",
    });
};

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;

    return new AppError(message, 400);
};

const handleDuplicateFileDB = () => {
    const message = `Duplicate field value, please enter another value.`;

    return new AppError(message, 400);
};

const handleJWTExpiredError = () => {
    const message = `Your token has expired, please enter another value.`;

    return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join(". ")}`;
    console.log(message);

    return new AppError(message, 400);
};

const handleJWTError = (err) => {
    return new AppError("Invalid token, please login again.", 401);
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === "production") {
        let error = { ...err };

        if (err.name === "castError") {
            error = handleCastErrorDB(error);
        }

        if (err.code === 1100) {
            error = handleDuplicateFileDB(error);
        }

        if (err.name === "ValidationError") {
            error = handleValidationErrorDB(error);
        }

        if (err.name === "JsonWebTokenError") {
            error = handleJWTError();
        }

        if (err.name === "TokenExpiredError") {
            error = handleJWTExpiredError();
        }
        sendErrorProd(error, req, res);
    }
};
