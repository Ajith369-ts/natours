const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

process.on("uncaughtException", (err) => {
    console.log("Uncaught exception!");
    console.log(err);
    process.exit(1);
});

const mongoose = require("mongoose");

const app = require("./app");

mongoose.connect(process.env.MONGO_LOCAL).then((con) => {
    console.log("DB connection established");
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log("Server running on port 3000");
});

process.on("unhandledRejection", (err) => {
    console.log("Unhandled rejection!");
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});
