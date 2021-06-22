const express = require("express");
const router = express.Router();

const {
  signupPatient,
  loginPatient,
  signupDoctor,
  loginDoctor,
} = require("../controllers/auth");
const { response_generator } = require("../middleware");

//PATIENT AUTH
router.post("/login/patients", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  const response = await loginPatient(username, password);

  let statusCode = 200;

  if (response.status === "UNAUTHORIZED") {
    statusCode = 401;
  } else if (response.status === "ERROR") {
    statusCode = 500;
  }
  return response_generator(statusCode, response, res);
});

router.post("/regis/patients", async (req, res) => {
  let data = req.body;

  const response = await signupPatient(data);
  const stat = response.status == "OK" ? 200 : 500;

  return response_generator(stat, response, res);
});

//DOCTOR AUTH
router.post("/login/doctors", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  const response = await loginDoctor(username, password);

  let statusCode = 200;

  if (response.status === "UNAUTHORIZED") {
    statusCode = 401;
  } else if (response.status === "ERROR") {
    statusCode = 500;
  }
  return response_generator(statusCode, response, res);
});

router.post("/regis/doctors", async (req, res) => {
  let data = req.body;

  const response = await signupDoctor(data);
  const stat = response.status == "OK" ? 200 : 500;

  return response_generator(stat, response, res);
});

module.exports = router;
