const mongoose = require("mongoose");

const combinedSchema = mongoose.Schema(
  {
    type: { type: Number, enum: [1, 2], default: 1 }, //1 - club , 2 - event
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      default: "",
    },
    poster: { type: String, default: "" },
    eventName: { type: String, default: "" },
    clubName: { type: String, default: "" },
    clubId: { type: mongoose.Schema.Types.ObjectId, ref: "Club", default: "" },
    timestamp: { type: Number, default: 0 },
    clubLogo: { type: String, default: "" },
    clubBackdrop: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Combined", combinedSchema);
