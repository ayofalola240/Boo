const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    mbti: {
      type: String,
    },
    enneagram: {
      type: String,
    },
    variant: {
      type: String,
    },
    tritype: {
      type: String,
    },
    socionics: {
      type: String,
    },
    sloan: {
      type: String,
    },
    psyche: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
  }
);

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
