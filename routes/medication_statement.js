const bodyParser = require("body-parser");
const express = require("express");
const { route } = require(".");
const router = express.Router();

router.use(bodyParser.json());

const {
  getAllMedState,
  createMedState,
} = require("../controllers/medication_statement");

const { response_generator } = require("../middleware");

//GET METHOD
router.get("/", async (req, res) => {
  const data = await getAllMedState();
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

module.exports = router;
