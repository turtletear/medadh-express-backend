const bodyParser = require("body-parser");
const express = require("express");
const { route } = require(".");
const router = express.Router();

router.use(bodyParser.json());

const {
  getAllPatients,
  createPatient,
  getPatientByUsername,
  getDoctorByPatientId,
  getPatientById,
  updatePatientById,
  deletePatientById,
} = require("../controllers/patients");

const {
  getDoctorByUsername,
  getDoctorById,
} = require("../controllers/doctors");

const {
  addDoctorsRequest,
  cancelAddDoctorsRequest,
} = require("../controllers/connectPatientDoctor");

const {
  getReportByPatientId,
  getSingleReportByPatientId,
  createReport,
  deleteReportById,
} = require("../controllers/diagnostic_report");

const {
  getMedStateByPatientId,
  getSingleMedStateByPatientId,
  createMedState,
  deleteMedStateById,
} = require("../controllers/medication_statement");

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

//get doctor
router.get("/doctor/username/:username", async (req, res) => {
  let username = req.params.username;
  const data = await getDoctorByUsername(username);
  const stat = data.status == "OK" ? 200 : 500;
  return response_generator(stat, data, res);
});

router.get("/doctor/:doctorId", async (req, res) => {
  let doctorId = req.params.doctorId;
  const data = await getDoctorById(doctorId);
  const stat = data.status == "OK" ? 200 : 500;
  return response_generator(stat, data, res);
});

router.get("/doctor/search/:patientId", async (req, res) => {
  let patientId = req.params.patientId;

  const data = await getDoctorByPatientId(patientId);
  const stat = data.status == "OK" ? 200 : 500;
  return response_generator(stat, data, res);
});

//post method
// router.post("/", async (req, res) => {
//   const newData = req.body;
//   const data = await createPatient(newData);
//   const stat = data.status == "OK" ? 200 : 500;

//   return response_generator(stat, data, res);
// });

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

//REPORT ROUTE
router.get("/reports/:patientId", async (req, res) => {
  let patientId = req.params.patientId;
  const data = await getReportByPatientId(patientId);
  const stat = data.status == "OK" ? 200 : 500;

  return response_generator(stat, data, res);
});

router.get("/reports/:patientId/:reportId", async (req, res) => {
  let patientId = req.params.patientId;
  let reportId = req.params.reportId;
  const data = await getSingleReportByPatientId(patientId, reportId);
  const stat = data.status == "OK" ? 200 : 500;

  return response_generator(stat, data, res);
});

router.post("/reports", async (req, res) => {
  const newData = req.body;
  const data = await createReport(newData);
  const stat = data.status == "OK" ? 200 : 500;

  return response_generator(stat, data, res);
});

router.delete("/reports/:reportId/:patientId", async (req, res) => {
  let reportId = req.params.reportId;
  let patientId = req.params.patientId;

  const data = await deleteReportById(patientId, reportId);
  const stat = data.status == "OK" ? 200 : 500;

  return response_generator(stat, data, res);
});

//MEDSTATE ROUTE
router.get("/medicationState/:patientId", async (req, res) => {
  let patientId = req.params.patientId;
  const data = await getMedStateByPatientId(patientId);
  const stat = data.status == "OK" ? 200 : 500;

  return response_generator(stat, data, res);
});

router.get("/medicationState/:patientId/:medStateId", async (req, res) => {
  let patientId = req.params.patientId;
  let medStateId = req.params.medStateId;
  const data = await getSingleMedStateByPatientId(patientId, medStateId);
  const stat = data.status == "OK" ? 200 : 500;

  return response_generator(stat, data, res);
});

router.post("/medicationState", async (req, res) => {
  const newData = req.body;
  const data = await createMedState(newData);
  const stat = data.status == "OK" ? 200 : 500;

  return response_generator(stat, data, res);
});

router.delete("/medicationState/:medStateId/:patientId", async (req, res) => {
  let medStateId = req.params.medStateId;
  let patientId = req.params.patientId;

  const data = await deleteMedStateById(patientId, medStateId);
  const stat = data.status == "OK" ? 200 : 500;

  return response_generator(stat, data, res);
});
module.exports = router;
