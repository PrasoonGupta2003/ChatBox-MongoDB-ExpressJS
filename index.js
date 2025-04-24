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
            from: "Neha",
            to: "Priya",
            msg: "How are you?",
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
        await Chat.findByIdAndUpdate(id, { msg: newMsg }, { runValidators: true, new: true });
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

// Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
