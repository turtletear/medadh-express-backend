const medState = require("../models/MedicationStatement");
const Mongoose = require("mongoose");

const { result_controller } = require("../middleware");

const getAllMedState = async () => {
  try {
    const result = await medState.find({});
    return result_controller("OK", result);
  } catch (error) {
    console.error(error);
    return result_controller("ERROR", null);
  }
};

const createMedState = async (newData) => {
  try {
    const result = await medState.create(newData);
    //update patient resource
    return result_controller("OK", result);
  } catch (error) {
    console.error(error);
    return result_controller("ERROR", null);
  }
};

module.exports = {
  getAllMedState,
  createMedState,
};
