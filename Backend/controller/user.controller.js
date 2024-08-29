const { User } = require("../model/user.model");

const createNewUser = async (req, res) => {
  const { firstName, lastName, email } = req.body;
  try {
    const newUser = new User({ firstName, lastName, email });
    await newUser.save();
    res.status(200).json({ msg: "New User added successfully!", newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find();
    res.status(200).json({ msg: "Getting All Users", allUsers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
};

const updateUser = async (req, res) => {
    const {id}=req.params;
    const {firstName,lastName,email}=req.body;
  try {
    const updateUser = await User.findByIdAndUpdate({_id:id},{firstName,lastName,email});
    if (!updateUser) {
        return res.status(404).json({ msg: "User not found." });
      }
      res.status(200).json({ msg: "User updated successfully!", updateUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
};

const deleteUser = async (req, res) => {
    const {id}=req.params;
  try {
    const deleteUser = await User.findByIdAndDelete({_id:id});
    if (!deleteUser) {
        return res.status(404).json({ msg: "User not found." });
      }
      res.status(200).json({ msg: "User deleted successfully!", deleteUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
};

module.exports = { createNewUser, getAllUsers, updateUser, deleteUser };
