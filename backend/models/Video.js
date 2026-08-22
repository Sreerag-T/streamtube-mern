import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      default: "",
      maxlength: 2000,
    },
    thumbnailUrl: {
      type: String,
      required: [true, "Thumbnail is required"],
    },
    videoUrl: {
      type: String,
      required: [true, "Video URL is required"],
    },
    category: {
      type: String,
      required: true,
      enum: [
        "All",
        "Web Development",
        "JavaScript",
        "Data Structures",
        "Music",
        "Gaming",
        "News",
        "Sports",
        "Education",
        "Entertainment",
      ],
      default: "All",
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
    },
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ],
    dislikes: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ],
  },
  { timestamps: true }
);

videoSchema.index({ title: "text" });

export default mongoose.model("Video", videoSchema);
