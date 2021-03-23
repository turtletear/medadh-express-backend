const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../config");
const { result_controller } = require("../middleware");

const { createPatient, getPatientByUsername } = require("./patients");
const { createDoctor, getDoctorByUsername } = require("./doctors");

const verifyPassword = async (password, hash) => {
  try {
    const isSame = await bcrypt.compareSync(password, hash);
    if (isSame == true) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

// PATIENT AUTH
const signupPatient = async (newData) => {
  try {
    const patient = await createPatient(newData);
    return patient;
  } catch (error) {
    console.error(error);
    return result_controller("ERROR", null);
  }
};

const loginPatient = async (username, password) => {
  try {
    const login = await getPatientByUsername(username);
    if (login.data === null) {
      return result_controller("UNAUTHORIZED", null);
    } else {
      const verifPassword = await verifyPassword(
        password,
        login.data.extension.password
      );
      if (verifPassword == true) {
        const token = jwt.sign(
          { id: login.data._id, role: login.data.resourceType },
          config.SECRET,
          {
            expiresIn: "1h",
          }
        );

        let authData = {
          ...login,
          token: token,
        };
        return result_controller("OK", authData);
      } else {
        return result_controller("UNAUTHORIZED", null);
      }
    }
  } catch (error) {
    console.error(error);
    return result_controller("ERROR", null);
  }
};

// DOCTOR AUTH
const signupDoctor = async (newData) => {
  try {
    const patient = await createPatient(newData);
    return patient;
  } catch (error) {
    console.error(error);
    return result_controller("ERROR", null);
  }
};

const loginDoctor = async (username, password) => {
  try {
    const login = await getDoctorByUsername(username);
    if (login.data === null) {
      return result_controller("UNAUTHORIZED", null);
    } else {
      const verifPassword = await verifyPassword(
        password,
        login.data.extension.password
      );
      if (verifPassword == true) {
        const token = jwt.sign(
          { id: login.data._id, role: login.data.resourceType },
          config.SECRET,
          {
            expiresIn: "1h",
          }
        );

        let authData = {
          ...login,
          token: token,
        };
        return result_controller("OK", authData);
      } else {
        return result_controller("UNAUTHORIZED", null);
      }
    }
  } catch (error) {
    console.error(error);
    return result_controller("ERROR", null);
  }
};

module.exports = {
  signupPatient,
  loginPatient,
  signupDoctor,
  loginDoctor,
};
