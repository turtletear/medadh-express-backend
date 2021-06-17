const DiagReports = require("../models/DiagnosticReport");
const Patients = require("../models/patientResource");
const Mongoose = require("mongoose");
const { result_controller } = require("../middleware");

const { getPatientById } = require("./patients");

const getAllReport = async () => {
  try {
    const reportList = await DiagReports.find({});
    return result_controller("OK", reportList);
  } catch (error) {
    console.error(error.message);
    return result_controller("ERROR", null);
  }
};

const getReportById = async (id) => {
  try {
    const reportData = await DiagReports.findById(id).exec();
    if (reportData) {
      return result_controller("OK", reportData);
    } else {
      return result_controller("ERROR Data not found", reportData);
    }
  } catch (error) {
    console.error(error.message);
    return result_controller("ERROR", null);
  }
};

const getReportByPatientId = async (patientId) => {
  try {
  } catch (error) {
    console.error(error.message);
  }
};

// const getSingleReportByPatientId = async (patientId) => {
//   try {

//     const reportData = await DiagReports.findById(id).exec();
//     if (reportData.)
//   } catch (error) {
//     console.error(error.message);
//   }
// };

const updatePatientReport = async (patientId, reportId) => {
  try {
    reportObjectId = Mongoose.Types.ObjectId(reportId);
    const result = await Patients.findByIdAndUpdate(
      patientId,
      {
        $push: { "extension.diagnosticReport": reportObjectId },
      },
      { new: true }
    );
    return result;
  } catch (error) {
    console.error(error.message);
    return null;
  }
};

const createReport = async (newData) => {
  try {
    let patientId = newData.subject;
    let patientObjectId = Mongoose.Types.ObjectId(patientId);
    newData.subject = patientObjectId;
    let checkPatient = await getPatientById(patientId);

    if (checkPatient.data != null) {
      const reportData = await DiagReports.create(newData);
      let reportId = reportData.id;
      const updatePatient = await updatePatientReport(patientId, reportId);
      return result_controller("OK", reportData);
    } else {
      return result_controller("ERROR Patient Id not found", null);
    }
  } catch (error) {
    console.error(error.message);
    return result_controller("ERROR", null);
  }
};

const updateReportById = async (id, updated) => {
  try {
    const updatedData = await DiagReports.findByIdAndUpdate(
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
    console.error(error.message);
    return result_controller("ERROR", null);
  }
};

const removePatientReport = async (patientId, reportId) => {
  try {
    const result = await Patients.findByIdAndUpdate(
      patientId,
      {
        $pull: { "extension.diagnosticReport": reportId },
      },
      { new: true }
    );
    return result;
  } catch (error) {
    console.error(error.message);
    return null;
  }
};

const deleteReportById = async (patientId, reportId) => {
  try {
    let checkPatient = await getPatientById(patientId);
    if (checkPatient.data != null) {
      const deletedData = await DiagReports.findByIdAndRemove(reportId).exec();
      if (deletedData != null) {
        const result = await removePatientReport(patientId, reportId);
        return result_controller("OK", deletedData);
      } else {
        return result_controller(
          "ERROR, dignostic report data not found",
          null
        );
      }
    } else {
      return result_controller("ERROR, patient data not found", null);
    }
  } catch (error) {
    console.error(error.message);
    return result_controller("ERROR", null);
  }
};
module.exports = {
  getAllReport,
  getReportById,
  createReport,
  updateReportById,
  deleteReportById,
};
