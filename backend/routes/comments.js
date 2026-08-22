import express from "express";
import {
  getCommentsForVideo,
  addComment,
  updateComment,
  deleteComment,
} from "../controllers/commentController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/video/:videoId", getCommentsForVideo);
router.post("/", protect, addComment);
router.put("/:id", protect, updateComment);
router.delete("/:id", protect, deleteComment);

export default router;
