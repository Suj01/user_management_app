const mongoose=require("mongoose");
require("dotenv").config();

const ConnectedToDataBase = mongoose.connect(process.env.DB_URL);

module.exports={ConnectedToDataBase}