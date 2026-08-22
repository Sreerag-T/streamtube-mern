import Video from "../models/Video.js";
import Channel from "../models/Channel.js";
import Comment from "../models/Comment.js";

// @route  GET /api/videos?search=&category=
// Public - powers the home page grid, search bar, and category filters
export const getVideos = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    if (category && category !== "All") {
      query.category = category;
    }

    const videos = await Video.find(query)
      .populate("channel", "channelName avatar")
      .sort({ createdAt: -1 });

    res.json(videos);
  } catch (error) {
    next(error);
  }
};

// @route  GET /api/videos/:id
export const getVideoById = async (req, res, next) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("channel", "channelName avatar subscribers");

    if (!video) return res.status(404).json({ message: "Video not found" });

    const videoObj = video.toObject();
    videoObj.likeCount = video.likes.length;
    videoObj.dislikeCount = video.dislikes.length;

    if (req.user) {
      const userId = req.user._id.toString();
      videoObj.myReaction = video.likes.some((id) => id.toString() === userId)
        ? "like"
        : video.dislikes.some((id) => id.toString() === userId)
        ? "dislike"
        : null;
    } else {
      videoObj.myReaction = null;
    }

    delete videoObj.likes;
    delete videoObj.dislikes;

    res.json(videoObj);
  } catch (error) {
    next(error);
  }
};

// @route  POST /api/videos  (protected - must own the channel)
export const createVideo = async (req, res, next) => {
  try {
    const { title, description, thumbnailUrl, videoUrl, category, channelId } = req.body;

    if (!title || !thumbnailUrl || !videoUrl || !channelId) {
      return res.status(400).json({ message: "title, thumbnailUrl, videoUrl and channelId are required" });
    }

    const channel = await Channel.findById(channelId);
    if (!channel) return res.status(404).json({ message: "Channel not found" });
    if (channel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to upload to this channel" });
    }

    const video = await Video.create({
      title,
      description,
      thumbnailUrl,
      videoUrl,
      category: category || "All",
      channel: channel._id,
      uploader: req.user._id,
    });

    channel.videos.push(video._id);
    await channel.save();

    res.status(201).json(video);
  } catch (error) {
    next(error);
  }
};

// @route  PUT /api/videos/:id  (protected - owner only)
export const updateVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });
    if (video.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this video" });
    }

    const { title, description, thumbnailUrl, videoUrl, category } = req.body;
    if (title) video.title = title;
    if (description !== undefined) video.description = description;
    if (thumbnailUrl) video.thumbnailUrl = thumbnailUrl;
    if (videoUrl) video.videoUrl = videoUrl;
    if (category) video.category = category;

    await video.save();
    res.json(video);
  } catch (error) {
    next(error);
  }
};

// @route  DELETE /api/videos/:id  (protected - owner only)
export const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });
    if (video.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this video" });
    }

    await Comment.deleteMany({ video: video._id });
    await Channel.findByIdAndUpdate(video.channel, { $pull: { videos: video._id } });
    await video.deleteOne();

    res.json({ message: "Video deleted" });
  } catch (error) {
    next(error);
  }
};

// @route  PUT /api/videos/:id/like  (protected)
export const likeVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const userId = req.user._id.toString();
    const hasLiked = video.likes.some((id) => id.toString() === userId);
    const hasDisliked = video.dislikes.some((id) => id.toString() === userId);

    if (hasLiked) {
      video.likes = video.likes.filter((id) => id.toString() !== userId);
    } else {
      video.likes.push(req.user._id);
      if (hasDisliked) video.dislikes = video.dislikes.filter((id) => id.toString() !== userId);
    }

    await video.save();
    res.json({ likes: video.likes.length, dislikes: video.dislikes.length, liked: !hasLiked, disliked: false });
  } catch (error) {
    next(error);
  }
};

// @route  PUT /api/videos/:id/dislike  (protected)
export const dislikeVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const userId = req.user._id.toString();
    const hasDisliked = video.dislikes.some((id) => id.toString() === userId);
    const hasLiked = video.likes.some((id) => id.toString() === userId);

    if (hasDisliked) {
      video.dislikes = video.dislikes.filter((id) => id.toString() !== userId);
    } else {
      video.dislikes.push(req.user._id);
      if (hasLiked) video.likes = video.likes.filter((id) => id.toString() !== userId);
    }

    await video.save();
    res.json({ likes: video.likes.length, dislikes: video.dislikes.length, liked: false, disliked: !hasDisliked });
  } catch (error) {
    next(error);
  }
};
