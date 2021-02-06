const express = require("express");
const { route } = require(".");
const router = express.Router();

const {
  getAllDoctors,
  createDoctor,
  getDoctorByUsername,
  getDoctorById,
  updateDoctorById,
  deleteDoctorById,
} = require("../controllers/doctors");

const { response_generator } = require("../middleware");
//get method
router.get("/", async (req, res) => {
  const data = await getAllDoctors();
  const stat = data.status == "OK" ? 200 : 500;
  return response_generator(stat, data, res);
});

router.get("/username/:username", async (req, res) => {
  let username = req.params.username;
  const data = await getDoctorByUsername(username);
  const stat = data.status == "OK" ? 200 : 500;
  return response_generator(stat, data, res);
});

router.get("/:doctorId", async (req, res) => {
  let doctorId = req.params.doctorId;
  const data = await getDoctorById(doctorId);
  const stat = data.status == "OK" ? 200 : 500;
  return response_generator(stat, data, res);
});

//post method
router.post("/", async (req, res) => {
  const newData = req.body;
  const data = await createDoctor(newData);
  const stat = data.status == "OK" ? 200 : 500;

  return response_generator(stat, data, res);
});

//put method
router.put("/:doctorId", async (req, res) => {
  let updatedData = req.body;
  let doctorId = req.params.doctorId;

  const data = await updateDoctorById(doctorId, updatedData);
  const stat = data.status == "OK" ? 200 : 500;

  return response_generator(stat, data, res);
});

//delete method
router.delete("/:doctorId", async (req, res) => {
  let doctorId = req.params.doctorId;

  const data = await deleteDoctorById(doctorId);
  const stat = data.status == "OK" ? 200 : 500;

  return response_generator(stat, data, res);
});

module.exports = router;
