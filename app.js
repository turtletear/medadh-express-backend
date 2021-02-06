var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var app = express();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var patientsRouter = require("./routes/patients");
var doctorsRouter = require("./routes/doctors");
//config
const config = require("./config");
const mongoose = require("mongoose");

//database setup
var uri = `${config.MONGO_URI}/${config.DB_NAME}`;
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

//routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/patients", patientsRouter);
app.use("/doctors", doctorsRouter);

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
