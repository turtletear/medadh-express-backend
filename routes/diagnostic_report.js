const express = require("express");
const { route } = require(".");
const router = express.Router();

const bodyParser = require("body-parser");
router.use(bodyParser.json());

const {
  getAllReport,
  getReportById,
  createReport,
  updateReportById,
  deleteReportById,
} = require("../controllers/diagnostic_report");

const { response_generator } = require("../middleware");
//get method
router.get("/", async (req, res) => {
  const data = await getAllReport();
  const stat = data.status == "OK" ? 200 : 500;

  return response_generator(stat, data, res);
});

router.get("/:reportId", async (req, res) => {
  let reportId = req.params.reportId;
  const data = await getReportById(reportId);
  const stat = data.status == "OK" ? 200 : 500;

  return response_generator(stat, data, res);
});

//post method
router.post("/", async (req, res) => {
  const newData = req.body;
  const data = await createReport(newData);
  const stat = data.status == "OK" ? 200 : 500;

  return response_generator(stat, data, res);
});

//put method
router.put("/:reportId", async (req, res) => {
  let updatedData = req.body;
  let reportId = req.params.reportId;

  const data = await updateReportById(reportId, updatedData);
  const stat = data.status == "OK" ? 200 : 500;

  return response_generator(stat, data, res);
});

//delete method
router.delete("/:reportId/:patientId", async (req, res) => {
  let reportId = req.params.reportId;
  let patientId = req.params.patientId;

  const data = await deleteReportById(patientId, reportId);
  const stat = data.status == "OK" ? 200 : 500;

  return response_generator(stat, data, res);
});
module.exports = router;
