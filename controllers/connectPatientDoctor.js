const Patients = require("../models/patientResource");
const Doctors = require("../models/doctorResource");
const Mongoose = require("mongoose");
const { result_controller } = require("../middleware");
const { getPatientById } = require("./patients");
const { getDoctorById } = require("./doctors");

//----------FUNCTIONS FOR PATIENT----------
const checkDoctorRequest = async (patientId, doctorId) => {
  //check wether doctorId is already exist in requestSend array
  try {
    const data = await getPatientById(patientId);
    let arr = data.data.extension.requestSent;
    if (arr.includes(doctorId)) {
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
  }
};

const removeRequestData = async (patientId, doctorId) => {
  try {
    const doctorObjectId = Mongoose.Types.ObjectId(doctorId);
    const requestSendData = await Patients.findByIdAndUpdate(
      patientId,
      { $pull: { "extension.requestSent": doctorObjectId } },
      { new: true }
    );

    const patientObjectId = Mongoose.Types.ObjectId(patientId);
    const requestRecievedData = await Doctors.findByIdAndUpdate(
      doctorId,
      { $pull: { "extension.requestRecieved": patientObjectId } },
      { new: true }
    );

    return [requestSendData, requestRecievedData];
  } catch (error) {
    console.error(error);
    return null;
  }
};

const addDoctorsRequest = async (patientId, doctorId) => {
  try {
    const patientFound = await getPatientById(patientId);
    const doctorFound = await getDoctorById(doctorId);
    const isExist = await checkDoctorRequest(patientId, doctorId);

    if (patientFound.data && doctorFound.data) {
      if (!isExist) {
        const doctorObjectId = Mongoose.Types.ObjectId(doctorId);
        const requestSendData = await Patients.findByIdAndUpdate(
          patientId,
          { $push: { "extension.requestSent": doctorObjectId } },
          { new: true }
        );

        const patientObjectId = Mongoose.Types.ObjectId(patientId);
        const requestRecievedData = await Doctors.findByIdAndUpdate(
          doctorId,
          { $push: { "extension.requestRecieved": patientObjectId } },
          { new: true }
        );
        if (requestSendData && requestRecievedData) {
          return result_controller("OK", requestSendData);
        } else {
          return result_controller("ERROR, request failed", null);
        } // end if
      } else return result_controller("ERROR, Id is already exist", null); //end if doctor already exist
    } else return result_controller("ERROR, Data not found", null); //end doctor and patient data is found
  } catch (error) {
    console.error(error.message);
    return result_controller("ERROR", null);
  }
};

const cancelAddDoctorsRequest = async (patientId, doctorId) => {
  try {
    const patientFound = await getPatientById(patientId);
    const doctorFound = await getDoctorById(doctorId);
    const isExist = await checkDoctorRequest(patientId, doctorId);

    if (patientFound.data && doctorFound.data) {
      if (isExist) {
        const [requestSendData, requestRecievedData] = await removeRequestData(
          patientId,
          doctorId
        );
        if (requestSendData && requestRecievedData) {
          return result_controller("OK", requestSendData);
        } else {
          return result_controller("ERROR request failed", null);
        } // end if
      } else return result_controller("ERROR Id is not exist", null); //end if doctor already exist
    } else return result_controller("ERROR Data not found", null); //end doctor and patient data is found
  } catch (error) {
    return result_controller("ERROR", null);
    console.error(error);
  }
};

//----------FUNCTIONS FOR DOCTOR----------

const checkPatientRequest = async (doctorId, patientId) => {
  //check wether patientId is already exist in patient array on doctor object
  try {
    const data = await getDoctorById(doctorId);
    let arr = data.data.extension.patients;
    let arr2 = data.data.extension.requestRecieved;
    if (!arr.includes(patientId) && arr2.includes(patientId)) {
      // patientId is not in array of patients and is in array of requestReceived
      return true;
    }
    return false;
  } catch (error) {
    console.error(error.message);
  }
};

const checkPatientRequest2 = async (doctorId, patientId) => {
  // for unBoundDoctorFromPatient
  //check wether patientId is already exist in patient array on doctor object
  try {
    const data = await getDoctorById(doctorId);
    let arr = data.data.extension.patients;
    let arr2 = data.data.extension.requestRecieved;
    if (arr.includes(patientId) && !arr2.includes(patientId)) {
      // patientId is not in array of patients and is in array of requestReceived
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
  }
};

const addDoctor = async (doctorId, patientId) => {
  try {
    const patientObjectId = Mongoose.Types.ObjectId(patientId);
    const addPatientToDoctor = await Doctors.findByIdAndUpdate(
      doctorId,
      { $push: { "extension.patients": patientObjectId } },
      { new: true }
    );

    const doctorObjectId = Mongoose.Types.ObjectId(doctorId);
    const addDoctorToPatient = await Patients.findByIdAndUpdate(
      patientId,
      { $push: { generalPractitioner: doctorObjectId } },
      { new: true }
    );
    return [addPatientToDoctor, addDoctorToPatient];
  } catch (error) {
    console.error(error);
    return null;
  }
};

const removeDoctor = async (doctorId, patientId) => {
  try {
    const patientObjectId = Mongoose.Types.ObjectId(patientId);
    const removePatientFromDoctor = await Doctors.findByIdAndUpdate(
      doctorId,
      { $pull: { "extension.patients": patientObjectId } },
      { new: true }
    );

    const doctorObjectId = Mongoose.Types.ObjectId(doctorId);
    const removeDoctorFromPatient = await Patients.findByIdAndUpdate(
      patientId,
      { $pull: { generalPractitioner: doctorObjectId } },
      { new: true }
    );
    return [removePatientFromDoctor, removeDoctorFromPatient];
  } catch (error) {
    console.error(error);
    return null;
  }
};

const confirmRequest = async (doctorId, patientId) => {
  //accept request and add patient to a doctor and add doctor to a patient if there is a request
  //remove patientId on requestReceive and doctorId on requestSent
  try {
    const patientFound = await getPatientById(patientId);
    const doctorFound = await getDoctorById(doctorId);
    const isExist = await checkPatientRequest(doctorId, patientId);

    if (doctorFound.data && patientFound.data) {
      if (isExist) {
        const [requestSendData, requestRecievedData] = await removeRequestData(
          patientId,
          doctorId
        );
        const [addPatientToDoctor, addDoctorToPatient] = await addDoctor(
          doctorId,
          patientId
        );
        if (addPatientToDoctor && addDoctorToPatient) {
          return result_controller("OK", addPatientToDoctor);
        } else {
          return result_controller("ERROR add failed", null);
        }
      } else {
        return result_controller(
          "ERROR Data is already exist / no request found",
          null
        );
      }
    } else {
      return result_controller("ERROR Data not found", null); //end if doctor and patient found
    }
  } catch (error) {
    console.error(error);
    return result_controller("ERROR", null);
  }
};

const unBoundDoctorFromPatient = async (doctorId, patientId) => {
  try {
    const patientFound = await getPatientById(patientId);
    const doctorFound = await getDoctorById(doctorId);
    const isExist = await checkPatientRequest2(doctorId, patientId);

    if (doctorFound.data && patientFound.data) {
      if (isExist) {
        const [removePatientFromDoctor, removeDoctorFromPatient] =
          await removeDoctor(doctorId, patientId);
        if (removePatientFromDoctor && removeDoctorFromPatient) {
          return result_controller("OK", removePatientFromDoctor);
        } else {
          return result_controller("ERROR remove failed", null);
        }
      } else {
        return result_controller(
          "ERROR Data is not exist in array patients nor doctors",
          null
        );
      }
    } else {
      return result_controller("ERROR Data not found", null); //end if doctor and patient found
    }
  } catch (error) {
    console.error(error);
    return result_controller("ERROR", null);
  }
};

module.exports = {
  addDoctorsRequest,
  cancelAddDoctorsRequest,
  confirmRequest,
  unBoundDoctorFromPatient,
};
