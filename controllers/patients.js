const Patient = require("../models/patientResource");
const Doctors = require("../models/doctorResource");
const Mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const round = 10;
const salt = bcrypt.genSaltSync(round);
const { result_controller } = require("../middleware");

const isExist = async (uname) => {
  try {
    let found = await Patient.findOne({
      "extension.username": uname,
    }).exec();
    if (found) {
      return true;
    } else return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const getAllPatients = async () => {
  try {
    const patientsList = await Patient.find({});
    return result_controller("OK", patientsList);
  } catch (error) {
    console.error(error);
    return result_controller("ERROR", null);
  }
};

const getPatientByUsername = async (usernameQuery) => {
  try {
    const patientData = await Patient.findOne({
      "extension.username": usernameQuery,
    }).exec();
    if (patientData) {
      //if data found
      return result_controller("OK", patientData);
    } else {
      return result_controller("ERROR user not found!", patientData);
    }
  } catch (error) {
    console.error(error);
    return result_controller("ERROR", null);
  }
};

const getPatientById = async (id) => {
  try {
    const patientData = await Patient.findById(id).exec();
    if (patientData) {
      //if data found
      return result_controller("OK", patientData);
    } else {
      return result_controller("ERROR user not found", patientData);
    }
  } catch (error) {
    console.error(error);
    return result_controller("ERROR", null);
  }
};

const createPatient = async (newData) => {
  try {
    let uname = newData.extension.username;
    let found = await isExist(uname);
    if (!found) {
      let hashed = bcrypt.hashSync(newData.extension.password, salt);
      newData.extension.password = hashed;
      const patientNewData = await Patient.create(newData);

      return result_controller("OK", patientNewData);
    } else {
      return result_controller("ERROR, Duplicate username", null);
    }
  } catch (error) {
    console.error(error);
    return result_controller("ERROR", null);
  }
};

const updatePatientById = async (id, updated) => {
  try {
    let hashed = bcrypt.hashSync(updated.extension.password, salt);
    updated.extension.password = hashed;

    const updatedData = await Patient.findByIdAndUpdate(
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
    const deletedData = await Patient.findByIdAndRemove(id).exec();
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
