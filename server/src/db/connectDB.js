import mongoose from "mongoose";

const connectDB = () => mongoose.connect(process.env.MONGODB_URL);
mongoose.set("strictQuery", true);

export default connectDB;
