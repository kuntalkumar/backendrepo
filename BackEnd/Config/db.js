const mongoose = require("mongoose");

const connection = async () => {
  try {
    const mongoURI =
"mongodb+srv://kuntalkumar789:kuntalkumar789@cluster0.vigwezr.mongodb.net/ptweb15";
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully.");
  } catch (err) {
    console.error("Error connecting to MongoDB: ", err);
  }
};

module.exports = {
  connection,
};