const express = require("express");
const mongoConnection = require("./db/mongoConnection.js");
const SchoolModel = require("./db/schoolModel.js");
const StudentModel = require("./db/studentModel.js");
const { default: axios } = require("axios");

const app = express();
const port = 5000;
app.use(express.json());

mongoConnection();

app.get("/", (req, res) => {
  res.json("Sucess to the scool + webhook tutorial");
});

// ? This controller is for adding schools in databases
app.post("/registerSchool", async (req, res) => {
  const { school, Id } = req.body;
  const index = await SchoolModel.find().countDocuments();
  const schoolDetails = await SchoolModel.create({ school, Id: index + 1 });
  res.status(201).json(schoolDetails);
});

// ? This below controller also a example of how to add arrays in mongodb atlas
// ! Webhook for the port 8000 specific school and also update the school modal array with WebHookDetails
app.post("/addWebhookEvent", async (req, res) => {
  try {
    let { school, Id, eventName, endpointUrl } = req.body;
    let schoolDetails = await SchoolModel.findOne({ Id: Id });

    // ! Add the webhook details additionality when anyone want to enter the school id and add them on webhookdetails array
    if (schoolDetails) {
      if (schoolDetails.webHookDetails === null) {
        schoolDetails.webHookDetails = [];
      }
      schoolDetails.webHookDetails.push({
        eventName: eventName,
        endpointUrl: endpointUrl,
      });

      // ! Updte the mongo scholl model with the new value
      const updatedSchoolDetails = await SchoolModel.findOneAndUpdate(
        { Id: Id },
        schoolDetails,
        {
          returnOriginal: false,
        }
      );
      res.json(updatedSchoolDetails);
    } else {
      res.json({ message: "No School not found On That Name" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ? This controller is for registering a new student to a particular school via the schoold Id
app.post("/registerStudent", async (req, res) => {
  try {
    const { Id, name, age } = req.body;
    let studentDetails = {};
    let schoolDetails = await SchoolModel.findOne({ Id: Id });
    if (schoolDetails) {
      studentDetails = await StudentModel.create({
        Id,
        name,
        age,
      });
      // ! From Here We Need To Trigger The WebHook For The Port 8000 as the student is registered and we need to send the info to server 8000
      let webHookUrl = "";
      for (i = 0; i < schoolDetails.webHookDetails.length; i++) {
        if (schoolDetails.webHookDetails[i].eventName === "newStudentAdd") {
          webHookUrl = schoolDetails.webHookDetails[i].endpointUrl; //! This line has error need to fix that
        }
      }
      if (webHookUrl !== null || webHookUrl.length > 0) {
        //! This line has error need to fix that
        // ? Goes the webHook response......
        let result = await axios.post(webHookUrl, studentDetails, {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      console.log("Web Hook Deta Send");
      //! End Of the WebHook Response Here
    } else {
      console.log("No School not found On That Name");
    }
    res.json({ message: "Student added successfully " + studentDetails.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
