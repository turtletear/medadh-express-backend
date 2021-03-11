const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//deprecating warning
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
const doctorSchema = new Schema(
  {
    resourceType: {
      type: String,
      default: "Practitioner",
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
        default: "default-Practitioner.png",
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

      patients: [
        {
          type: Schema.Types.ObjectId,
          ref: "Patients",
        },
      ],

      requestRecieved: [
        {
          type: Schema.Types.ObjectId,
          ref: "Patients",
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Doctors = mongoose.model("Doctors", doctorSchema);
module.exports = Doctors;
