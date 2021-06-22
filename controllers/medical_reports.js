const MedReports = require("../models/medical_report");
const { result_controller } = require("../middleware");

const getAllReport = async () => {
  try {
    const reportList = await MedReports.find({});
    return result_controller("OK", reportList);
  } catch (error) {
    console.error(error);
    return result_controller("ERROR", null);
  }
};

const getReportById = async (id) => {
  try {
    const reportData = await MedReports.findById(id).exec();
    if (reportData) {
      return result_controller("OK", reportData);
    } else {
      return result_controller("ERROR Data not found", reportData);
    }
  } catch (error) {
    console.error(error);
    return result_controller("ERROR", null);
  }
};

const createReport = async (newData) => {
  try {
    const reportData = await MedReports.create(newData);
    return result_controller("OK", reportData);
  } catch (error) {
    console.error(error);
    if (error.name === "MongoError" && error.code === 11000) {
      return result_controller("ERROR, Duplicate username", null);
    }
    return result_controller("ERROR", null);
  }
};

const updateReportById = async (id, updated) => {
  try {
    const updatedData = await MedReports.findByIdAndUpdate(
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

const deleteReportById = async (id) => {
  try {
    const deletedData = await MedReports.findByIdAndRemove(id).exec();
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
  getAllReport,
  getReportById,
  createReport,
  updateReportById,
  deleteReportById,
};
