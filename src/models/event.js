import { Schema, model } from "mongoose";

const eventSchema = Schema(
  {
    info: { type: String },
    videoLink: { type: String },
    isPaid: { type: Boolean, default: false },
    isGravitas: { type: Boolean, default: false },
    isRiviera: { type: Boolean, default: false },
    isHack: { type: Boolean, default: false },
    eventType: {
      type: String,
      enum: ["Technical", "Non-Technical"],
      default: "Technical",
    },
    eventCost: { type: Number },
    club: { type: Schema.Types.ObjectId, ref: "Club" },
    likes: { type: Number, default: 0 },
    startDate: { type: Date },
    startTime: { type: Date },
    registrationLink: { type: String },
    meetingLink: { type: String },
    poster: { type: String },
    venue: { type: String },
  },
  { timestamps: true }
);

export default model("Event", eventSchema);
