const Patients = require("../models/patients");
const Doctors = require("../models/doctors");
const Mongoose = require("mongoose");
const { result_controller } = require("../middleware");

const { getDoctorById } = require("./doctors");

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

const checkDoctorRequest = async (patientId, doctorId) => {
  //check wether doctorId is already exist
  try {
    const data = await getPatientById(patientId);
    let arr = data.data.doctors;
    if (arr.includes(doctorId)) {
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
  }
};

const addDoctorsRequest = async (patientId, doctorId) => {
  try {
    // console.log("save requestSend in an array(on patient model)");
    // console.log("save requestReceive in an array(on doctor model)");
    const patientFound = await getPatientById(patientId);
    const doctorFound = await getDoctorById(doctorId);
    const isExist = await checkDoctorRequest(patientId, doctorId);

    if (patientFound.data && doctorFound.data) {
      if (!isExist) {
        const objectId = Mongoose.Types.ObjectId(doctorId);
        const requestSendData = await Patients.findByIdAndUpdate(
          patientId,
          { $push: { doctors: objectId } },
          { new: true }
        );

        if (requestSendData) {
          return result_controller("OK", requestSendData);
        } else {
          return result_controller("ERROR request failed", requestSendData);
        } // end if
      } else return result_controller("ERROR Id is already exist", null); //end if doctor already exist
    } else return result_controller("ERROR Data not found", null); //end doctor and patient data is found
  } catch (error) {
    return result_controller("ERROR", null);
    console.error(error);
  }
};

const cancelAddDoctorsRequest = async (patientId, doctorId) => {
  try {
    // console.log("save requestSend in an array(on patient model)");
    // console.log("save requestReceive in an array(on doctor model)");
    const patientFound = await getPatientById(patientId);
    const doctorFound = await getDoctorById(doctorId);
    const isExist = await checkDoctorRequest(patientId, doctorId);

    if (patientFound.data && doctorFound.data) {
      if (isExist) {
        const objectId = Mongoose.Types.ObjectId(doctorId);
        const requestSendData = await Patients.findByIdAndUpdate(
          patientId,
          { $pull: { doctors: objectId } },
          { new: true }
        );

        if (requestSendData) {
          return result_controller("OK", requestSendData);
        } else {
          return result_controller("ERROR request failed", requestSendData);
        } // end if
      } else return result_controller("ERROR Id is not exist", null); //end if doctor already exist
    } else return result_controller("ERROR Data not found", null); //end doctor and patient data is found
  } catch (error) {
    return result_controller("ERROR", null);
    console.error(error);
  }
};
module.exports = {
  getAllPatients,
  createPatient,
  getPatientByUsername,
  getPatientById,
  updatePatientById,
  deletePatientById,
  addDoctorsRequest,
  cancelAddDoctorsRequest,
};
