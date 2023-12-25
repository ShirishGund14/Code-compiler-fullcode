const mongoose = require("mongoose");

const Code = new mongoose.Schema(
  {
    title: {
      type: String,
      require: [true, "title is required"],
    },
    language: {
      type: String,
      require: [true, "title is required"],
    },
    description: {
      type: String,
      required: [true, "description is require"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      require: [true, "user id is required"],
    },
  },
  { timestamps: true }
);

const codeModel = mongoose.model("Code", Code);

module.exports = codeModel;
