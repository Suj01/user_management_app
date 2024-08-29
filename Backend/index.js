const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { ConnectedToDataBase } = require("./config/db.config");
const { userRouter } = require("./route/user.route");

const port = process.env.PORT || 8100;

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  console.log("Server is up!");
});

app.use("/user", userRouter);

app.listen(port, async () => {
  try {
    await ConnectedToDataBase;
    console.log("Database is connected successfully!");
    console.log(`Your server is running at port ${port}`);
  } catch (error) {
    console.log(error);
  }
});
