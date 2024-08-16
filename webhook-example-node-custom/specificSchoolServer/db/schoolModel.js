const mongoose = require("mongoose");

const SchoolSchema = new mongoose.Schema({
  school: String,
  Id: Number,
});

const SchoolModel = mongoose.model("School", SchoolSchema);

module.exports = SchoolModel;
