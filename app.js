require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const mongoose = require("mongoose");

const app = express();

// DATABASE CONFIG.
const mongoDB = process.env.MONGO_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// APP MIDDLEWARES.
// TODO: const corsOptions = {};
app.use(cors({
  origin: "http://localhost:3000/", // For now, until everything is done.
}));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

// Passport initialization;
const passport = require("./config/passport");
app.use(passport.initialize());

// ROUTE.
const apiRouter = require("./routes/apiRouter");

app.use("/api", apiRouter);

// ERROR HANDLING MIDDLEWARES.
const { unknownEndpoint, errorHandler } = require("./middleware/errorHandle");
app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
});
