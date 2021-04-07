import { Schema, model } from "mongoose";

const clubSchema = Schema(
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
      enum: ["Technical", "Non-technical", "NGO"],
      default: "Technical",
    },
    description: {
      type: String,
    },
    linkedIn: {
      type: String,
    },
    instagram: {
      type: String,
    },
    medium: {
      type: String,
    },
    youtube: {
      type: String,
    },
    twitter: {
      type: String,
    },
    logo: {
      type: String,
    },
    backdrop: {
      type: String,
    },
    events: [
      {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
  },
  { timestamps: true }
);

export default model("Club", clubSchema);
