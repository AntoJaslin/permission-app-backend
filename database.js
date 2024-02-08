const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/passport-JWT-Strategy");
mongoose.connection
  .once("open", () => {
    console.log("DB connected");
  })
  .on("error", (error) => {
    console.log("error is:", error);
  });
