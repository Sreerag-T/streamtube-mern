import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { validateRegisterInput, validateLoginInput } from "../utils/validators.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// @route  POST /api/auth/register
export const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const { isValid, errors } = validateRegisterInput(req.body);
    if (!isValid) return res.status(400).json({ message: "Validation failed", errors });

    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ message: "Validation failed", errors: { email: "Email already registered" } });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Validation failed", errors: { username: "Username already taken" } });
    }

    const user = await User.create({ username, email, password });

    // Registration succeeds -> frontend redirects to /login per spec, so we don't auto-login here
    res.status(201).json({
      message: "Registration successful. Please log in.",
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

// @route  POST /api/auth/login
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { isValid, errors } = validateLoginInput(req.body);
    if (!isValid) return res.status(400).json({ message: "Validation failed", errors });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        channels: user.channels,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route  GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("channels", "channelName handle");
    res.json(user);
  } catch (error) {
    next(error);
  }
};
