import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: process.env.DB_NAME
    });
    console.log("DB online...!!!");
  } 
  catch (error) {
    console.log(`Error: ${error.message}`);
  }
};


export default connectDB;

