const mongoose = require("mongoose");

const eventSchema = mongoose.Schema(
  {
    shortName: { type: String, default: "" },
    website: { type: String, default: "" },
    info: { type: String, default: "" },
    name: { type: String, required: true },
    clubName: { type: String, default: "" },
    videoLink: { type: String, default: "" },
    isPaid: { type: Boolean, default: false },
    eventType: [
      {
        type: String,
        enum: [
          "Gravitas",
          "Riviera",
          "Hackathon",
          "Workshop",
          "Speaker",
          "Cultural",
          "NGO",
        ],
      },
    ],
    eventCost: { type: Number, default: 0 },
    clubId: { type: mongoose.Schema.Types.ObjectId, ref: "Club", default: "" },
    likes: { type: Number, default: 0 },
    timestamp: { type: Number, default: 0 },
    duration: { type: Number, default: 1 },
    registrationLink: { type: String, default: "" },
    meetingLink: { type: String, default: "" },
    poster: { type: String, default: "" },
    venue: { type: String, default: "" },
    views: { type: Number, default: 0 },
    vtopRegistrations: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
