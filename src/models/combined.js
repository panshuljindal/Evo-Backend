const mongoose = require("mongoose");

const combinedSchema = mongoose.Schema({
  type: { type: Number, enum: [1, 2], default: 1 }, //1 - club , 2 - event
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    default: "610a5be2ac4b7a00152939f7",
  },
  poster: { type: String, default: "" },
  eventName: { type: String, default: "" },
  clubName: { type: String, default: "" },
  clubId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Club",
    default: "610a5be2ac4b7a00152939f7",
  },
  timestamp: { type: Number, default: 0 },
  clubLogo: { type: String, default: "" },
  clubBackdrop: { type: String, default: "" },
  price: { type: Number, default: 0 },
});

module.exports = mongoose.model("Combined", combinedSchema);
