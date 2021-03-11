const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//deprecating warning
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

const DiagnosticReportSchema = new Schema(
  {
    resourceType: {
      type: String,
      default: "DiagnosticReport",
    },

    status: {
      type: String,
      default: "Final",
    },

    category: {
      coding: {
        code: {
          type: String,
          default: "LAB",
        },
        display: {
          type: String,
          default: "Laboratory",
        },
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
      effectivePeriod: {
        start: {
          type: Date,
        },
        end: {
          type: Date,
        },
      },
    },

    issued: {
      type: Date,
      default: Date.now,
    },

    media: [
      {
        link: {
          type: String,
        },
      },
    ],

    extension: {
      bcr_abl: {
        display: {
          type: String,
          default: "BCR/ABL",
        },
        value: {
          type: Number,
        },
      },
      wblood_cell: {
        display: {
          type: String,
          default: "White Blood Cell",
        },
        value: {
          type: Number,
        },
      },
      hemoglobin: {
        display: {
          type: String,
          default: "Hemoglobin",
        },
        value: {
          type: Number,
        },
      },
      note: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

const DiagnosticReport = mongoose.model(
  "DiagnosticReport",
  DiagnosticReportSchema
);
module.exports = DiagnosticReport;
