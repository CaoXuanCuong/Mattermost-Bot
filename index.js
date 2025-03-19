require('dotenv').config()
const express = require("express");
const Schedule = require("./src/schedules");
const app = express();
const port = 8747;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`);
  Schedule.init();
});
