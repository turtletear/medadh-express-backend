const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//deprecating warning
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
const patientSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    userImage: {
      type: String,
      default: "default.png",
    },
    doctors: [
      {
        type: Schema.Types.ObjectId,
        ref: "Doctors",
      },
    ],
    requestSent: [
      {
        type: Schema.Types.ObjectId,
        ref: "Doctors",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Patients = mongoose.model("Patients", patientSchema);
module.exports = Patients;
