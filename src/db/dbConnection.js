import mongoose from "mongoose";

async function connectDB(){
  try {
    await mongoose.connect(process.env.DB_URL)
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw Error('Failed to connect to MongoDB');
  }
}

export default connectDB;