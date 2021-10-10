const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    likedEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
    interestedEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
