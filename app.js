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
const whitelist = [
  "https://ecstatic-nobel-1cf38c.netlify.app/",
  "http://localhost:3000",
];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.options("*", cors(corsOptions));

// Passport initialization;
const passport = require("./config/passport");
app.use(passport.initialize());

// ROUTE.
const apiRouter = require("./routes/apiRouter");

app.use("/api", cors(corsOptions), apiRouter);

// ERROR HANDLING MIDDLEWARES.
const { unknownEndpoint, errorHandler } = require("./middleware/errorHandle");
app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
});
