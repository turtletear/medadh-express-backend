const Patients = require("../models/patientResource");
const Doctor = require("../models/doctorResource");
const Mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const round = 10;
const salt = bcrypt.genSaltSync(round);
const { result_controller } = require("../middleware");

const isExist = async (uname) => {
  try {
    let found = await Doctor.findOne({
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

const getAllDoctors = async () => {
  try {
    const doctorList = await Doctor.find({});
    return result_controller("OK", doctorList);
  } catch (error) {
    console.error();
    return result_controller("ERROR", null);
  }
};

const getDoctorByUsername = async (username) => {
  try {
    const doctorData = await Doctor.findOne({
      "extension.username": username,
    }).exec();
    if (doctorData) {
      //if data found
      return result_controller("OK", doctorData);
    } else {
      return result_controller("ERROR user not found!", null);
    }
  } catch (error) {
    console.error(error);
    return result_controller("ERROR", null);
  }
};

const getDoctorById = async (id) => {
  try {
    const doctorData = await Doctor.findById(id).exec();
    if (doctorData) {
      //if data found
      return result_controller("OK", doctorData);
    } else {
      return result_controller("ERROR data not found!", null);
    }
  } catch (error) {
    console.error(error);
    return result_controller("ERROR", null);
  }
};

const createDoctor = async (newData) => {
  try {
    let uname = newData.extension.username;
    let found = await isExist(uname);
    if (!found) {
      //check username whether exist
      let hashed = bcrypt.hashSync(newData.extension.password, salt);
      newData.extension.password = hashed;
      const doctorData = await Doctor.create(newData);

      return result_controller("OK", doctorData);
    } else {
      return result_controller("ERROR, Duplicate username", null);
    }
  } catch (error) {
    console.error(error);
    return result_controller("ERROR", null);
  }
};

const updateDoctorById = async (id, updated) => {
  try {
    let hashed = bcrypt.hashSync(updated.extension.password, salt);
    updated.extension.password = hashed;

    const updatedData = await Doctor.findByIdAndUpdate(
      id,
      { $set: updated },
      { new: true }
    ).exec();
    if (updatedData) {
      return result_controller("OK", updatedData);
    } else {
      return result_controller("ERROR Data not found", null);
    }
  } catch (error) {
    console.error(error);
    return result_controller("ERROR", null);
  }
};

const deleteDoctorById = async (id) => {
  try {
    const deletedData = await Doctor.findByIdAndRemove(id).exec();
    if (deletedData) {
      return result_controller("OK", deletedData);
    } else {
      return result_controller("ERROR Data not found", null);
    }
  } catch (error) {
    console.error(error);
    return result_controller("ERROR", null);
  }
};

module.exports = {
  getAllDoctors,
  createDoctor,
  getDoctorByUsername,
  getDoctorById,
  updateDoctorById,
  deleteDoctorById,
};
