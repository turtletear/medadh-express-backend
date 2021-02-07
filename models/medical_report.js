const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//deprecating warning
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

const medReportSchema = new Schema(
  {
    bcr_abl: {
      type: Number,
    },
    wblood_cell: {
      type: Number,
    },
    hemoglobin: {
      type: Number,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Patients",
    },
    note: {
      type: String,
    }, //array of files
  },
  {
    timestamps: true,
  }
);

const MedReports = mongoose.model("MedReports", medReportSchema);
module.exports = MedReports;
