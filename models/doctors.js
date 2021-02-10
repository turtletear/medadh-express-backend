const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//deprecating warning
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
const doctorSchema = new Schema(
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
  {
    timestamps: true,
  }
);

const Doctors = mongoose.model("Doctors", doctorSchema);
module.exports = Doctors;
