import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
  {
    channelName: {
      type: String,
      required: [true, "Channel name is required"],
      trim: true,
      minlength: 3,
      maxlength: 40,
    },
    handle: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      default: "",
      maxlength: 500,
    },
    channelBanner: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    subscribers: {
      type: Number,
      default: 0,
    },
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Channel", channelSchema);
