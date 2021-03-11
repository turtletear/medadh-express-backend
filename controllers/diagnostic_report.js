const DiagReports = require("../models/DiagnosticReport");
const Patients = require("../models/patientResource");
const { result_controller } = require("../middleware");

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

const updatePatientReport = async (patientId, reportId) => {
  try {
    const result = await Patients.findByIdAndUpdate(
      patientId,
      {
        $push: { "extension.diagnosticReport": reportId },
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
    const reportData = await DiagReports.create(newData);
    let patientId = newData.subject;
    let reportId = reportData.id;
    const updatePatient = await updatePatientReport(patientId, reportId);
    return result_controller("OK", reportData);
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
    const result = await removePatientReport(patientId, reportId);
    const deletedData = await DiagReports.findByIdAndRemove(reportId).exec();
    if (deletedData && result) {
      return result_controller("OK", deletedData);
    } else {
      return result_controller(
        "ERROR, dignostic report or patient data not found",
        deletedData
      );
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
