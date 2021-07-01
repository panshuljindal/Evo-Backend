const mongoose = require("mongoose");

const eventSchema = mongoose.Schema(
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
    club: { type: mongoose.Schema.Types.ObjectId, ref: "Club" },
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

module.exports=mongoose.model("Event", eventSchema);
