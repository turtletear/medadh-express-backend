const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//deprecating warning
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

const MedicationStatementSchema = new Schema(
  {
    resourceType: {
      type: String,
      default: "MedicationStatement",
    },
    status: {
      text: {
        type: String,
      },
    },
    subject: {
      type: Schema.Types.ObjectId,
      ref: "Patients",
    },
    effective: {
      effectiveDateTime: {
        type: Date,
      },
    },
    dateAsserted: {
      type: Date,
    },
    category: {
      coding: {
        system: {
          type: String,
          default: "http://hl7.org/fhir/2017jan/index.html",
        },
        version: {
          type: String,
          default: "1.8.0",
        },
        code: {
          type: String,
        },
      },
      text: {
        type: String,
      },
    },
    dosage: {
      text: {
        type: String,
      },
    },
    note: {
      text: {
        type: String,
      },
    },
    extension: {
      isLate: {
        type: Boolean,
      },
    },
  },
  {
    timestamps: true,
  }
);

const MedicationStatement = mongoose.model(
  "MedicationStatement",
  MedicationStatementSchema
);
module.exports = MedicationStatement;
