const mongoose = require("mongoose");

MONGO_URI =
  "mongodb+srv://rafikul_22:babu123@cluster0.7czq9eo.mongodb.net/webhooks?retryWrites=true&w=majority&appName=Cluster0";

const mongoConnection = () => {
  mongoose.connect(MONGO_URI);

  const db = mongoose.connection;

  db.on("error", (error) => console.error(error));
  db.once("open", () => console.log("Connected to MongoDB"));
};

module.exports = mongoConnection;
