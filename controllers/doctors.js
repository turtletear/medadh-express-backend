const Doctors = require("../models/doctors");
const { result_controller } = require("../middleware");

const getAllDoctors = async () => {
  try {
    const doctorList = await Doctors.find({});
    return result_controller("OK", doctorList);
  } catch (error) {
    console.error();
    return result_controller("ERROR", null);
  }
};

const getDoctorByUsername = async (username) => {
  try {
    const doctorData = await Doctors.find({ username: username }).exec();
    if (doctorData.length) {
      //if data found
      return result_controller("OK", doctorData);
    } else {
      return result_controller("ERROR data not found!", doctorData);
    }
  } catch (error) {
    console.error(error);
    return result_controller("ERROR", null);
  }
};

const getDoctorById = async (id) => {
  try {
    const doctorData = await Doctors.findById(id).exec();
    if (doctorData) {
      //if data found
      return result_controller("OK", doctorData);
    } else {
      return result_controller("ERROR data not found!", doctorData);
    }
  } catch (error) {
    console.error(error);
    return result_controller("ERROR", null);
  }
};

const createDoctor = async (newData) => {
  try {
    const doctorData = await Doctors.create(newData);
    return result_controller("OK", doctorData);
  } catch (error) {
    console.error(error);
    if (error.name === "MongoError" && error.code === 11000) {
      return result_controller("ERROR, Duplicate username", null);
    }
    return result_controller("ERROR", null);
  }
};

const updateDoctorById = async (id, updated) => {
  try {
    const updatedData = await Doctors.findByIdAndUpdate(
      id,
      { $set: updated },
      { new: true }
    ).exec();
    if (updatedData) {
      return result_controller("OK", updatedData);
    } else {
      return result_controller("ERROR Data not found", updatedData);
    }
  } catch (error) {
    console.error(error);
    return result_controller("ERROR", null);
  }
};

const deleteDoctorById = async (id) => {
  try {
    const deletedData = await Doctors.findByIdAndRemove(id).exec();
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
  getAllDoctors,
  createDoctor,
  getDoctorByUsername,
  getDoctorById,
  updateDoctorById,
  deleteDoctorById,
};
