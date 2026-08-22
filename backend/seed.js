// Seeds the database with sample users, channels, videos and comments
// so evaluators can run the app immediately. Run with: npm run seed
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Channel from "./models/Channel.js";
import Video from "./models/Video.js";
import Comment from "./models/Comment.js";

dotenv.config();

const seed = async () => {
  await connectDB();

  console.log("Clearing existing data...");
  await Promise.all([
    User.deleteMany(),
    Channel.deleteMany(),
    Video.deleteMany(),
    Comment.deleteMany(),
  ]);

  console.log("Creating users...");
  const john = await User.create({
    username: "JohnDoe",
    email: "john@example.com",
    password: "password123",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  });

  const priya = await User.create({
    username: "PriyaCodes",
    email: "priya@example.com",
    password: "password123",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
  });

  console.log("Creating channels...");
  const johnChannel = await Channel.create({
    channelName: "Code with John",
    handle: "@codewithjohn",
    owner: john._id,
    description: "Coding tutorials and tech reviews by John Doe.",
    channelBanner: "https://picsum.photos/seed/johnbanner/1200/300",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    subscribers: 5200,
  });

  const priyaChannel = await Channel.create({
    channelName: "Priya Builds",
    handle: "@priyabuilds",
    owner: priya._id,
    description: "Full-stack projects, DSA and career tips.",
    channelBanner: "https://picsum.photos/seed/priyabanner/1200/300",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    subscribers: 8100,
  });

  john.channels.push(johnChannel._id);
  await john.save();
  priya.channels.push(priyaChannel._id);
  await priya.save();

  console.log("Creating videos...");
  const videosData = [
    {
      title: "Learn React in 30 Minutes",
      description: "A quick tutorial to get started with React.",
      thumbnailUrl: "https://picsum.photos/seed/react30/400/225",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      category: "Web Development",
      channel: johnChannel._id,
      uploader: john._id,
      views: 15200,
    },
    {
      title: "JavaScript Closures Explained",
      description: "Understand closures once and for all with real examples.",
      thumbnailUrl: "https://picsum.photos/seed/closures/400/225",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      category: "JavaScript",
      channel: johnChannel._id,
      uploader: john._id,
      views: 8400,
    },
    {
      title: "Binary Search Trees from Scratch",
      description: "Build a BST in JavaScript step by step.",
      thumbnailUrl: "https://picsum.photos/seed/bst/400/225",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      category: "Data Structures",
      channel: priyaChannel._id,
      uploader: priya._id,
      views: 6200,
    },
    {
      title: "Build a REST API with Express & MongoDB",
      description: "End to end backend tutorial for beginners.",
      thumbnailUrl: "https://picsum.photos/seed/expressapi/400/225",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      category: "Web Development",
      channel: priyaChannel._id,
      uploader: priya._id,
      views: 11300,
    },
    {
      title: "Lofi Beats to Code To",
      description: "Two hours of chill lofi for deep work sessions.",
      thumbnailUrl: "https://picsum.photos/seed/lofi/400/225",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      category: "Music",
      channel: johnChannel._id,
      uploader: john._id,
      views: 42000,
    },
    {
      title: "Top 5 VS Code Extensions in 2026",
      description: "Boost your productivity with these extensions.",
      thumbnailUrl: "https://picsum.photos/seed/vscode/400/225",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      category: "Web Development",
      channel: priyaChannel._id,
      uploader: priya._id,
      views: 3100,
    },
  ];

  const videos = await Video.insertMany(videosData);

  johnChannel.videos = videos.filter((v) => v.channel.toString() === johnChannel._id.toString()).map((v) => v._id);
  priyaChannel.videos = videos.filter((v) => v.channel.toString() === priyaChannel._id.toString()).map((v) => v._id);
  await johnChannel.save();
  await priyaChannel.save();

  console.log("Creating comments...");
  await Comment.create({
    text: "Great video! Very helpful.",
    video: videos[0]._id,
    user: priya._id,
  });
  await Comment.create({
    text: "Finally understood closures, thanks!",
    video: videos[1]._id,
    user: john._id,
  });

  console.log("Seed complete.");
  console.log("Sample login: john@example.com / password123");
  console.log("Sample login: priya@example.com / password123");
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
