require("dotenv").config();

const mongoose = require("mongoose");

function connectDbatabase() {
  //databse connection
  mongoose.connect(process.env.MONGO_CONNECTION_URL);
  const connection = mongoose.connection;
  connection
    .once("open", () => {
      console.log("Database connected 🥳🥳🥳🥳");
    })
    .on("error", function (err) {
      console.log("Connection failed ☹️☹️☹️☹️");
    });
}

module.exports = connectDbatabase;
