const express = require("express");
const {
  createNewUser,
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../controller/user.controller");

const userRouter = express.Router();

userRouter.post("/create", createNewUser);
userRouter.get("/get", getAllUsers);
userRouter.put("/update/:id", updateUser);
userRouter.delete("/delete/:id", deleteUser);

module.exports = { userRouter };
