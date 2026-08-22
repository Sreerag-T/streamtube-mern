import Comment from "../models/Comment.js";
import Video from "../models/Video.js";

// @route  GET /api/comments/video/:videoId
export const getCommentsForVideo = async (req, res, next) => {
  try {
    const comments = await Comment.find({ video: req.params.videoId })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    next(error);
  }
};

// @route  POST /api/comments  (protected)
export const addComment = async (req, res, next) => {
  try {
    const { videoId, text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text cannot be empty" });
    }

    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const comment = await Comment.create({
      text: text.trim(),
      video: videoId,
      user: req.user._id,
    });

    await comment.populate("user", "username avatar");
    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

// @route  PUT /api/comments/:id  (protected - author only)
export const updateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this comment" });
    }

    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text cannot be empty" });
    }

    comment.text = text.trim();
    await comment.save();
    await comment.populate("user", "username avatar");
    res.json(comment);
  } catch (error) {
    next(error);
  }
};

// @route  DELETE /api/comments/:id  (protected - author only)
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (error) {
    next(error);
  }
};
