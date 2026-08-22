import Channel from "../models/Channel.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

// @route  POST /api/channels  (protected)
export const createChannel = async (req, res, next) => {
  try {
    const { channelName, handle, description, channelBanner, avatar } = req.body;

    if (!channelName || channelName.trim().length < 3) {
      return res.status(400).json({ message: "Channel name must be at least 3 characters" });
    }
    if (!handle || handle.trim().length < 2) {
      return res.status(400).json({ message: "Handle is required" });
    }

    const cleanHandle = handle.startsWith("@") ? handle : `@${handle}`;
    const existing = await Channel.findOne({ handle: cleanHandle });
    if (existing) {
      return res.status(400).json({ message: "That handle is already taken" });
    }

    const channel = await Channel.create({
      channelName,
      handle: cleanHandle,
      owner: req.user._id,
      description: description || "",
      channelBanner: channelBanner || "",
      avatar: avatar || "",
    });

    await User.findByIdAndUpdate(req.user._id, { $push: { channels: channel._id } });

    res.status(201).json(channel);
  } catch (error) {
    next(error);
  }
};

// @route  GET /api/channels/:id
export const getChannelById = async (req, res, next) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate("owner", "username avatar")
      .populate({ path: "videos", options: { sort: { createdAt: -1 } } });

    if (!channel) return res.status(404).json({ message: "Channel not found" });
    res.json(channel);
  } catch (error) {
    next(error);
  }
};

// @route  GET /api/channels/mine/list  (protected) - channels owned by logged-in user
export const getMyChannels = async (req, res, next) => {
  try {
    const channels = await Channel.find({ owner: req.user._id });
    res.json(channels);
  } catch (error) {
    next(error);
  }
};

// @route  PUT /api/channels/:id  (protected, owner only)
export const updateChannel = async (req, res, next) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ message: "Channel not found" });
    if (channel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this channel" });
    }

    const { channelName, description, channelBanner, avatar } = req.body;
    if (channelName) channel.channelName = channelName;
    if (description !== undefined) channel.description = description;
    if (channelBanner !== undefined) channel.channelBanner = channelBanner;
    if (avatar !== undefined) channel.avatar = avatar;

    await channel.save();
    res.json(channel);
  } catch (error) {
    next(error);
  }
};

// @route  DELETE /api/channels/:id  (protected, owner only)
export const deleteChannel = async (req, res, next) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ message: "Channel not found" });
    if (channel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this channel" });
    }

    await Video.deleteMany({ channel: channel._id });
    await channel.deleteOne();
    await User.findByIdAndUpdate(req.user._id, { $pull: { channels: channel._id } });

    res.json({ message: "Channel deleted" });
  } catch (error) {
    next(error);
  }
};
