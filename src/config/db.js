const mongoose = require("mongoose");

const connDB = async (url, dbName) => {

  try {
    await mongoose.connect(url, { dbName });
    console.log("DB online...!!!");
  } 
  
  catch (error) {
    console.log(`Error: ${error.message}`);
  }

};

module.exports = { connDB };
