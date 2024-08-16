const express = require("express");

const app = express();
const port = 8000;
app.use(express.json());

// mongoConnection();

app.get("/", (req, res) => {
  res.json("Sucess to the specific school");
});

app.post("/webhook/studentAdd", async (req, res) => {
  let data = req.body;
  res.json("Webhook data received and student name: " + data.name);
});

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
