const mongoose = require("mongoose");

const eventSchema = mongoose.Schema(
  {
    shortName: { type: String },
    tagline: { type: String },
    website: { type: String },
    info: { type: String },
    name: { type: String, required: true },
    clubName: { type: String },
    videoLink: { type: String },
    isPaid: { type: Boolean, default: false },
    isGravitas: { type: Boolean, default: false },
    isRiviera: { type: Boolean, default: false },
    isHack: { type: Boolean, default: false },
    eventType: {
      type: String,
      enum: ["Technical", "Non-Technical", "Cultural", "NGO"],
      default: "Technical",
    },
    eventCost: { type: Number },
    clubId: { type: mongoose.Schema.Types.ObjectId, ref: "Club" },
    likes: { type: Number, default: 0 },
    timestamp: { type: Number },
    duration: { type: Number },
    registrationLink: { type: String },
    meetingLink: { type: String },
    poster: { type: String },
    venue: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
