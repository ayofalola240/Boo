const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    profileID: {
      type: mongoose.Types.ObjectId,
      ref: "Profile",
    },
    personality: {
      type: Array,
      default: [],
    },
    title: {
      type: String,
    },
    comment: {
      type: String,
    },
    likes: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
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

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
