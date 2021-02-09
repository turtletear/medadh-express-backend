const bodyParser = require("body-parser");
const express = require("express");
const { route } = require(".");
const router = express.Router();

router.use(bodyParser.json());

const {
  getAllPatients,
  createPatient,
  getPatientByUsername,
  getPatientById,
  updatePatientById,
  deletePatientById,
  addDoctorsRequest,
  cancelAddDoctorsRequest,
} = require("../controllers/patients");

const { response_generator } = require("../middleware");
//get method
router.get("/", async (req, res) => {
  const data = await getAllPatients();
  const stat = data.status == "OK" ? 200 : 500;
  return response_generator(stat, data, res);
});

router.get("/username/:username", async (req, res) => {
  let username = req.params.username;
  const data = await getPatientByUsername(username);
  const stat = data.status == "OK" ? 200 : 500;
  return response_generator(stat, data, res);
});

router.get("/:patientId", async (req, res) => {
  let patientId = req.params.patientId;
  //console.log(id)
  const data = await getPatientById(patientId);
  const stat = data.status == "OK" ? 200 : 500;
  return response_generator(stat, data, res);
});

//post method
router.post("/", async (req, res) => {
  const newData = req.body;
  const data = await createPatient(newData);
  const stat = data.status == "OK" ? 200 : 500;

  return response_generator(stat, data, res);
});

router.post("/doctorreq/:patientId/:doctorId", async (req, res) => {
  const patientId = req.params.patientId;
  const doctorId = req.params.doctorId;
  const data = await addDoctorsRequest(patientId, doctorId);
  const stat = data.status == "OK" ? 200 : 500;

  return response_generator(stat, data, res);
});

//put method
router.put("/:patientId", async (req, res) => {
  let updatedData = req.body;
  let patientId = req.params.patientId;

  const data = await updatePatientById(patientId, updatedData);
  const stat = data.status == "OK" ? 200 : 500;

  return response_generator(stat, data, res);
});

router.put("/canceldoctorreq/:patientId/:doctorId", async (req, res) => {
  const patientId = req.params.patientId;
  const doctorId = req.params.doctorId;
  const data = await cancelAddDoctorsRequest(patientId, doctorId);
  const stat = data.status == "OK" ? 200 : 500;

  return response_generator(stat, data, res);
});

//delete method
router.delete("/:patientId", async (req, res) => {
  let patientId = req.params.patientId;

  const data = await deletePatientById(patientId);
  const stat = data.status == "OK" ? 200 : 500;

  return response_generator(stat, data, res);
});
module.exports = router;
