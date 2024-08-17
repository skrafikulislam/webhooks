const mongoose = require("mongoose");

MONGO_URI =
  ""

const mongoConnection = () => {
  mongoose.connect(MONGO_URI);

  const db = mongoose.connection;

  db.on("error", (error) => console.error(error));
  db.once("open", () => console.log("Connected to MongoDB"));
};

module.exports = mongoConnection;
