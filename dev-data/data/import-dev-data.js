const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const mongoose = require("mongoose");
const Tour = require("../../models/tourModel");
const Review = require("../../models/reviewModel");
const User = require("../../models/userModel");

mongoose.connect(process.env.MONGO_LOCAL).then((con) => {
    console.log("DB connection established");
});

// Read JSON file

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const reviews = JSON.parse(
    fs.readFileSync(`${__dirname}/reviews.json`, "utf-8")
);

// Import data
const importData = async () => {
    try {
        await Tour.create(tours);
        await User.create(users, { validateBeforeSave: false });
        await Review.create(reviews);
        console.log("Data successfully imported");
        process.exit();
    } catch (err) {
        console.log(err);
    }
};

// Delete all data in db
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log("Data successfully deleted");
        process.exit();
    } catch (err) {
        console.log(err);
    }
};

if (process.argv[2] == "--import") {
    importData();
}

if (process.argv[2] == "--delete") {
    deleteData();
}
