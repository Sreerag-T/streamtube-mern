import express from "express";
import {
  getVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  likeVideo,
  dislikeVideo,
} from "../controllers/videoController.js";
import { protect, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getVideos);
router.get("/:id", optionalAuth, getVideoById);
router.post("/", protect, createVideo);
router.put("/:id", protect, updateVideo);
router.delete("/:id", protect, deleteVideo);
router.put("/:id/like", protect, likeVideo);
router.put("/:id/dislike", protect, dislikeVideo);

export default router;
