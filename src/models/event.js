const mongoose = require("mongoose");

const eventSchema = mongoose.Schema(
  {
    shortName: { type: String, default: "" },
    tagline: { type: String, default: "" },
    website: { type: String, default: "" },
    info: { type: String, default: "" },
    name: { type: String, required: true },
    clubName: { type: String, default: "" },
    videoLink: { type: String, default: "" },
    isPaid: { type: Boolean, default: false },
    isGravitas: { type: Boolean, default: false },
    isRiviera: { type: Boolean, default: false },
    isHack: { type: Boolean, default: false },
    eventType: {
      type: String,
      enum: ["Technical", "Non-Technical", "Cultural", "NGO"],
      default: "Technical",
    },
    eventCost: { type: Number, default: 0 },
    clubId: { type: mongoose.Schema.Types.ObjectId, ref: "Club", default: "" },
    likes: { type: Number, default: 0, default: "" },
    timestamp: { type: Number, default: 0 },
    duration: { type: Number, default: 1 },
    registrationLink: { type: String, default: "" },
    meetingLink: { type: String, default: "" },
    poster: { type: String, default: "" },
    venue: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
