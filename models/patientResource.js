const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//deprecating warning
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
const patientSchema = new Schema(
  {
    resourceType: {
      type: String,
      default: "Patient",
    },

    name: {
      given: {
        type: String,
        required: true,
      },
    },

    gender: {
      type: String,
    },

    photo: {
      uri: {
        type: String,
        default: "default.png",
      },
    },

    telecom: {
      system: {
        type: String,
        default: "Email",
      },
      value: {
        type: String,
      },
    },

    generalPractitioner: [
      {
        type: Schema.Types.ObjectId,
        ref: "Doctors",
      },
    ],

    extension: {
      username: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      requestSent: [
        {
          type: Schema.Types.ObjectId,
          ref: "Doctors",
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
