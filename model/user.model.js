import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    channelName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      reuired: true,
      unique: true,
    },
    password: {
      type: String,
      reuired: true,
    },
    phone: {
      type: String,
      reuired: true,
    },
    logoUrl: {
      type: String,
      reuired: true,
    },
    logoId: {
      type: String,
      reuired: true,
    },
    subscriber: {
      type: Number,
      default: 0,
    },
    subscriberedChannels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  },
);
const userModel = mongoose.model("User", userSchema);
export default userModel;
