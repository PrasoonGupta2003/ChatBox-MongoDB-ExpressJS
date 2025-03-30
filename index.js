const express =require("express");
const app = express();
const path=require("path");

const methodOverride=require("method-override");
app.use(methodOverride("_method"));

const Chat=require("./models/chat.js");

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({ extended:true }));
const mongoose=require("mongoose");
main().then(()=>{
    console.log("Connection Setup!");
})
.catch((err) => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/chatUp');
}

let chat1=new Chat({
    from:"Neha",
    to:"Priya",
    msg:"How are you?",
    created_at:new Date(),
})
chat1.save()
.then((res)=>{
    console.log(res);
})
.catch((err)=>{
    console.log(err);
})
//Show route
app.get("/chats",async (req,res)=>{
    let chats=await Chat.find();
    res.render("index.ejs",{chats});
})
//New route
app.get("/chats/new",(req,res)=>{
    res.render("new.ejs");
})

//Create route
app.post("/chats",(req,res)=>{
    let {from,to,msg} = req.body;
    let newChat=new Chat({
        from:from,  
        to:to,
        msg:msg,
        created_at:new Date(),
    })
    console.log(newChat);
    newChat.save().then((res)=>{console.log(res)}).catch((err)=>{console.log(err)});
    res.redirect("/chats");
})

//Edit route
app.get("/chats/:id/edit",async (req,res)=>{
    let {id}=req.params;
    let chat=await Chat.findById(id);
    res.render("edit.ejs",{chat});
})

//Update route
app.put("/chats/:id",(req,res)=>{
    let {id}=req.params;
    let {msg:newMsg}=req.body;
    let updatedChat=Chat.findByIdAndUpdate(
        id,
        {msg:newMsg},
        {runValidators:true,new:true}
    );
    console.log(updatedChat);
    res.redirect("/chats");
})

//Delete
app.delete("/chats/:id",async (req,res)=>{
    let {id}= req.params;
    let chatToBeDeleted=await Chat.findByIdAndDelete(id);
    console.log(chatToBeDeleted);
    res.redirect("/chats");
})

app.get("/",(req, res) => {
    res.send("Root is Working");
})

app.listen(8080, () => {
    console.log("App is listening on port 8080");
})