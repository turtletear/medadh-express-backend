const medState = require("../models/MedicationStatement");
const Patients = require("../models/patientResource");
const Mongoose = require("mongoose");
const { result_controller } = require("../middleware");

const { getPatientById } = require("./patients");

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

const getMedStateByPatientId = async (patientId) => {
  try {
    let checkPatient = await getPatientById(patientId);
    if (checkPatient.data != null) {
      let medStateData = await Patients.findById(patientId).populate({
        path: "extension.medicationStatment",
        model: "MedicationStatement",
      });
      return result_controller("OK", medStateData.extension.medicationStatment);
    } else {
      return result_controller("ERROR patient not found", null);
    }
  } catch (error) {
    console.error(error.message);
    return result_controller("ERROR", null);
  }
};

const getSingleMedStateByPatientId = async (patientId, medStateId) => {
  try {
    let checkPatient = await getPatientById(patientId);
    if (checkPatient.data != null) {
      let medStateData = await Patients.findById(patientId).populate({
        path: "extension.medicationStatment",
        model: "MedicationStatement",
        match: { _id: medStateId },
      });
      if (medStateData.extension.medicationStatment.length != 0) {
        return result_controller(
          "OK",
          medStateData.extension.medicationStatment
        );
      } else {
        return result_controller("ERROR medical statement not found", null);
      }
    } else {
      return result_controller("ERROR patient not found", null);
    }
  } catch (error) {
    console.error(error.message);
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
    let patientId = newData.subject;
    let patientObjectId = Mongoose.Types.ObjectId(patientId);
    newData.subject = patientObjectId;
    let checkPatient = await getPatientById(patientId);

    if (checkPatient.data != null) {
      const result = await medState.create(newData);
      //update patient resource
      let medStateId = result.id;
      const updatePatient = await updatePatientMedState(patientId, medStateId);
      return result_controller("OK", result);
    } else {
      return result_controller("ERROR Patient Id not found", null);
    }
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
    let checkPatient = await getPatientById(patientId);
    if (checkPatient.data != null) {
      const deletedData = await medState.findByIdAndRemove(medStateId);
      if (deletedData != null) {
        const result = await removePatientMedState(patientId, medStateId);
        return result_controller("OK", deletedData);
      } else {
        return result_controller(
          "ERROR, medication state data not found",
          null
        );
      }
    } else {
      return result_controller("ERROR, patient data not found", null);
    }
  } catch (error) {
    console.error(error);
    return result_controller("ERROR", null);
  }
};

module.exports = {
  getAllMedState,
  getMedStateById,
  getMedStateByPatientId,
  getSingleMedStateByPatientId,
  createMedState,
  updateMedStateById,
  deleteMedStateById,
};
