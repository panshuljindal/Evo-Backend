const mongoose = require("mongoose");

const combinedSchema = mongoose.Schema(
  {
    type: { type: Number, enum: [1, 2] }, //1 - club , 2 - event
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    poster: { type: String },
    eventName: { type: String },
    clubName: { type: String },
    clubId: { type: mongoose.Schema.Types.ObjectId, ref: "Club" },
    isPartner: { type: Boolean, default: false },
    timestamp: { type: Number },
    clubLogo: { type: String },
    clubBackdrop:{ type: String },
    eventType: {
      type: String,
      enum: ["Technical", "Non-Technical", "Cultural", "NGO"],
      default: "Technical",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Combined", combinedSchema);
