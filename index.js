const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const Chat = require("./models/chat.js");

// Middleware
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// View Engine Setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// MongoDB Connection
async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB Connected");
  await insertDummyChat();
}

main().catch((err) => console.log("❌ MongoDB Error:", err));

// Insert dummy chat if collection is empty
async function insertDummyChat() {
  const count = await Chat.countDocuments();
  if (count === 0) {
    let chat1 = new Chat({
      from: "Creator",
      to: "Global",
      msg: "Welcome to ChatBox 💬Your seamless, secure, and social messaging platform.At ChatBox, we believe communication should be effortless and enjoyable. Whether you are connecting with friends, sharing ideas, or exploring our smart AI Assistant, we have built a space where you can chat freely and express yourself without limits.",
      created_at: new Date(),
    });
    await chat1.save();
    console.log("📥 Sample chat inserted.");
  }
}

// Routes
app.get("/", (req, res) => {
  res.redirect("/chats");
});

// Show all chats
app.get("/chats", async (req, res) => {
  try {
    let chats = await Chat.find();
    res.render("index.ejs", { chats });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching chats.");
  }
});

// DELETE all chats
app.delete("/chats/deleteAll", async (req, res) => {
  try {
    await Chat.deleteMany({});
    res.redirect("/chats");
  } catch (err) {
    console.error("Failed to delete chat history:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Form to create new chat
app.get("/chats/new", (req, res) => {
  res.render("new.ejs");
});

// Create new chat
app.post("/chats", async (req, res) => {
  try {
    let { from, to, msg } = req.body;
    let newChat = new Chat({
      from,
      to,
      msg,
      created_at: new Date(),
    });
    await newChat.save();
    res.redirect("/chats");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error saving chat.");
  }
});

// Edit form
app.get("/chats/:id/edit", async (req, res) => {
  try {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", { chat });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching chat.");
  }
});

// Update chat
app.put("/chats/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let { msg: newMsg } = req.body;
    await Chat.findByIdAndUpdate(
      id,
      { msg: newMsg },
      { runValidators: true, new: true }
    );
    res.redirect("/chats");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error updating chat.");
  }
});

// Delete chat
app.delete("/chats/:id", async (req, res) => {
  try {
    let { id } = req.params;
    await Chat.findByIdAndDelete(id);
    res.redirect("/chats");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error deleting chat.");
  }
});

//  API Route to Fetch Chats
app.get("/api/chats", async (req, res) => {
  try {
    let chats = await Chat.find().sort({ created_at: -1 });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch chats" });
  }
});

//Like chats
app.post("/chats/:id/like", async (req, res) => {
  let { id } = req.params;
  await Chat.findByIdAndUpdate(id, { $inc: { likes: 1 } });
  res.sendStatus(200);
});

// POST /api/sendMessage
app.post("/api/sendMessage", async (req, res) => {
  try {
    const newChat = new Chat({
      from: "Anonymous",
      to: "Global",
      msg: req.body.msg,
    });
    await newChat.save();
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
});
// Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
