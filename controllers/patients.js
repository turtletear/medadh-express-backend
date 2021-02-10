const Patients = require("../models/patients");
const Doctors = require("../models/doctors");
const Mongoose = require("mongoose");
const { result_controller } = require("../middleware");

const getAllPatients = async () => {
  try {
    const patientsList = await Patients.find({});
    return result_controller("OK", patientsList);
  } catch (error) {
    console.error(error);
    return result_controller("ERROR", null);
  }
};

const getPatientByUsername = async (username) => {
  try {
    const patientData = await Patients.find({ username: username }).exec();
    if (patientData.length) {
      //if data found
      return result_controller("OK", patientData);
    } else {
      return result_controller("ERROR data not found!", patientData);
    }
  } catch (error) {
    console.error(error);
    return result_controller("ERROR", null);
  }
};

const getPatientById = async (id) => {
  try {
    const patientData = await Patients.findById(id).exec();
    if (patientData) {
      //if data found
      return result_controller("OK", patientData);
    } else {
      return result_controller("ERROR Data not found", patientData);
    }
  } catch (error) {
    console.error(error);
    return result_controller("ERROR", null);
  }
};

const createPatient = async (newData) => {
  try {
    const patientNewData = await Patients.create(newData);
    return result_controller("OK", patientNewData);
  } catch (error) {
    console.error(error);
    if (error.name === "MongoError" && error.code === 11000) {
      return result_controller("ERROR, Duplicate username", null);
    }
    return result_controller("ERROR", null);
  }
};

const updatePatientById = async (id, updated) => {
  try {
    const updatedData = await Patients.findByIdAndUpdate(
      id,
      { $set: updated },
      { new: true }
    ).exec();
    if (updatedData) {
      //if data found
      return result_controller("OK", updatedData);
    } else {
      return result_controller("ERROR Data not found", updatedData);
    }
  } catch (error) {
    console.error(error);
    return result_controller("ERROR", null);
  }
};

const deletePatientById = async (id) => {
  try {
    const deletedData = await Patients.findByIdAndRemove(id).exec();
    if (deletedData) {
      return result_controller("OK", deletedData);
    } else {
      return result_controller("ERROR Data not found", deletedData);
    }
  } catch (error) {
    console.error(error);
    return result_controller("ERROR", null);
  }
};

module.exports = {
  getAllPatients,
  createPatient,
  getPatientByUsername,
  getPatientById,
  updatePatientById,
  deletePatientById,
};
