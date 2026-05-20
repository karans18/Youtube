import mongoose from "mongoose";
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    throw new Error("something went wrong", err);
    process.exit(1);
  }
};

export default connectDB;
