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
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

// Passport initialization;
const passport = require("./config/passport");
app.use(passport.initialize());

// ROUTE.
const apiRouter = require("./routes/apiRouter");

app.use("/api", cors(corsOptionsDelegate), apiRouter);

// ERROR HANDLING MIDDLEWARES.
const { unknownEndpoint, errorHandler } = require("./middleware/errorHandle");
app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
});
