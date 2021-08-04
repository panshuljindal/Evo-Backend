const mongoose = require("mongoose");

const clubSchema = mongoose.Schema(
  {
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [
        function (v) {
          var re = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
          return re.test(v);
        },
        "Please enter a valid Email ID",
      ],
    },
    name: {
      type: String,
      required: true,
    },
    clubType: {
      type: String,
      enum: ["Technical", "Non-Technical", "NGO"],
      default: "Technical",
    },
    description: {
      type: String,
      default: "",
    },
    linkedIn: {
      type: String,
      default: "",
    },
    instagram: {
      type: String,
      default: "",
    },
    medium: {
      type: String,
      default: "",
    },
    youtube: {
      type: String,
      default: "",
    },
    twitter: {
      type: String,
      default: "",
    },
    logo: {
      type: String,
      default: "",
    },
    backdrop: {
      type: String,
      default: "",
    },
    isVerified: { type: Boolean, default: false },
    isPartner: { type: Boolean, default: false },
    events: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Club", clubSchema);
