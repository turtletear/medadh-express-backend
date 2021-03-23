const config = require("../config");
const jwt = require("jsonwebtoken");

const notAllowed = (res, statusCode, message) => {
  const data = {
    status: message,
    data: null,
  };
  res.statusCode = statusCode;
  res.json(data);
};

const patientJWTAuth = async (req, res, next) => {
  //
  try {
    //check roles
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      const verified = jwt.verify(token, config.SECRET);

      if (verified) {
        req.user = verified;
        console.log(verified); //check role here
        if (verified.role == "Patient") {
          next();
        } else {
          notAllowed(res, 401, "UNAUTHORIZED");
        }
      }
    } else {
      notAllowed(res, 401, "UNAUTHORIZED");
    }
  } catch (error) {
    notAllowed(res, 403, "FORBIDDEN");
  }
};

const doctorJWTAuth = async (req, res, next) => {
  //
  try {
    //check roles
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      const verified = jwt.verify(token, config.SECRET);

      if (verified) {
        req.user = verified;
        console.log(verified); //check role here
        if (verified.role == "Practitioner") {
          next();
        } else {
          notAllowed(res, 401, "UNAUTHORIZED");
        }
      }
    } else {
      notAllowed(res, 401, "UNAUTHORIZED");
    }
  } catch (error) {
    notAllowed(res, 403, "FORBIDDEN");
  }
};

module.exports = { patientJWTAuth, doctorJWTAuth };
