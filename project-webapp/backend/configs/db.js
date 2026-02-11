import mongoose from "mongoose";

const connectDB = async () => {
    console.log("Connection invoked");
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: true
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed");
    console.error(error.message);
    process.exit(1);
  }
};

export default connectDB;
