import mongoose from "mongoose";
import { Schema } from "mongoose";

const meetingSchema = new Schema(
    {
        userId: { type: String },
        meetingCode: { type: String, required: true },
        date: { type: Date, default: Date.now }
    }
);

const Meeting = mongoose.model("Meeting", meetingSchema);

export { Meeting }