require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path");
const cors = require("cors");

//static path
app.use(express.static("public"));

const connectDB = require("./config/db");
connectDB();

//cors

const corsOptions = {
  origin: process.env.ALLOWED_CLIENTS.split(","),
};

app.use(cors(corsOptions));

//parse JSON data
app.use(express.json());

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

// Routes

//1. Create a recodrd for the file and send the download link
app.use("/api/files", require("./routes/files"));

//2. show the download page corresponding to the url
app.use("/files", require("./routes/show"));

//3. find the file with the given uuid and download
app.use("/files/download", require("./routes/download"));

app.get("/", (req, res) => {
  res.send("Hello!!");
});

app.listen(PORT, console.log(`Listening on port ${PORT}.`));
