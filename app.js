var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var app = express();

var indexRouter = require("./routes/index");
var patientsRouter = require("./routes/patients");
var doctorsRouter = require("./routes/doctors");
var reportRouter = require("./routes/diagnostic_report");
var medicationState = require("./routes/medication_statement");
var authRouter = require("./routes/auth");

//config
const config = require("./config");
const mongoose = require("mongoose");

// Auth middleware
var { patientJWTAuth, doctorJWTAuth } = require("./middleware/auth");

//database setup
var uri = `${config.MONGO_URI}/${config.DB_NAME}`; //local dbase
var uri2 = config.MONGO_URII.toString(); //remote dbase (mongodb atlas)
var connect = mongoose.connect(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

connect.then(
  (db) => {
    console.log("Connected to Database!");
  },
  (err) => {
    console.error(err);
  }
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//middleware - routes
app.use("/", indexRouter);
app.use("/patients", patientJWTAuth, patientsRouter);
app.use("/doctors", doctorJWTAuth, doctorsRouter);
app.use("/reports", reportRouter);
app.use("/medicationState", medicationState);
app.use("/auth", authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
