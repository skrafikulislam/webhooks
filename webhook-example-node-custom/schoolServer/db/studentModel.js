const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  Id: Number,
});

const StudentModel = mongoose.model("Student", StudentSchema);

module.exports = StudentModel;
