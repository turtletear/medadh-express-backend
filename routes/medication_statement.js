const bodyParser = require("body-parser");
const express = require("express");
const { route } = require(".");
const router = express.Router();

router.use(bodyParser.json());

const {
  getAllMedState,
  getMedStateById,
  createMedState,
  updateMedStateById,
  deleteMedStateById,
} = require("../controllers/medication_statement");

const { response_generator } = require("../middleware");

//GET METHOD
router.get("/", async (req, res) => {
  const data = await getAllMedState();
  const stat = data.status == "OK" ? 200 : 500;
  return response_generator(stat, data, res);
});

router.get("/:medStateId", async (req, res) => {
  let medStateId = req.params.medStateId;
  const data = await getMedStateById(medStateId);
  const stat = data.status == "OK" ? 200 : 500;

  return response_generator(stat, data, res);
});

//POST METHOD
router.post("/", async (req, res) => {
  const newData = req.body;
  const data = await createMedState(newData);
  const stat = data.status == "OK" ? 200 : 500;

  return response_generator(stat, data, res);
});

//PUT METHOD
router.put("/:medStateId", async (req, res) => {
  let medStateId = req.params.medStateId;
  let updatedData = req.body;
  const data = await updateMedStateById(medStateId, updatedData);
  const stat = data.status == "OK" ? 200 : 500;

  return response_generator(stat, data, res);
});

//DELETE METHOD
router.delete("/:medStateId/:patientId", async (req, res) => {
  let medStateId = req.params.medStateId;
  let patientId = req.params.patientId;

  const data = await deleteMedStateById(patientId, medStateId);
  const stat = data.status == "OK" ? 200 : 500;

  return response_generator(stat, data, res);
});

module.exports = router;
