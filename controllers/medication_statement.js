const medState = require("../models/MedicationStatement");
const Patients = require("../models/patientResource");
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

const getMedStateById = async (id) => {
  try {
    const result = await medState.findById(id).exec();
    if (result) {
      return result_controller("OK", result);
    } else {
      return result_controller("ERROR, Data not found", null);
    }
  } catch (error) {
    console.error(error);
    return result_controller("ERROR", null);
  }
};

const updatePatientMedState = async (patientId, medStateId) => {
  try {
    const result = await Patients.findByIdAndUpdate(
      patientId,
      {
        $push: { "extension.medicationStatment": medStateId },
      },
      { new: true }
    );
    return result;
  } catch (error) {
    console.error(error.message);
    return null;
  }
};

const createMedState = async (newData) => {
  try {
    const result = await medState.create(newData);
    //update patient resource
    let patientId = newData.subject;
    let medStateId = result.id;
    const updatePatient = await updatePatientMedState(patientId, medStateId);
    return result_controller("OK", result);
  } catch (error) {
    console.error(error);
    return result_controller("ERROR", null);
  }
};

const updateMedStateById = async (id, updated) => {
  try {
    const updatedData = await medState
      .findByIdAndUpdate(id, { $set: updated }, { new: true })
      .exec();
    if (updatedData) {
      return result_controller("OK", updatedData);
    } else {
      return result_controller("ERROR, Data not found", null);
    }
  } catch (error) {
    console.error(error);
    return result_controller("ERROR", null);
  }
};

const removePatientMedState = async (patientId, medStateId) => {
  try {
    const result = await Patients.findByIdAndUpdate(
      patientId,
      {
        $pull: { "extension.medicationStatment": medStateId },
      },
      { new: true }
    );
    return result;
  } catch (error) {
    console.error(error.message);
    return null;
  }
};

const deleteMedStateById = async (patientId, medStateId) => {
  try {
    const result = await removePatientMedState(patientId, medStateId);
    const deletedData = await medState.findByIdAndRemove(medStateId);
    if (deletedData && result) {
      return result_controller("OK", result);
    } else {
      return result_controller(
        "ERROR, medical statement or patient data not found",
        null
      );
    }
  } catch (error) {
    console.error(error);
    return result_controller("ERROR", null);
  }
};

module.exports = {
  getAllMedState,
  getMedStateById,
  createMedState,
  updateMedStateById,
  deleteMedStateById,
};
