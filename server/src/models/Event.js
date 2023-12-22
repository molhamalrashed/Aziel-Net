import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  date: Date,
  title: String,
  link: String,
  description: String,
  picture: String, // URL or path to the event picture
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User who creates the event
  timestamp: { type: Date, default: Date.now },
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
