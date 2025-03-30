const mongoose=require("mongoose");
const Chat=require("./models/chat.js");

main().then(()=>{
    console.log("Connection Setup!");
})
.catch((err) => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/chatUp');
}

let chats=[{
    from:"Neha",
    to:"Priya",
    msg:"How are you?",
    created_at:new Date(),
},
{
    from:"Rohit",
    to:"Mohit",
    msg:"Lets study guyzz",
    created_at:new Date(),
},
{
    from:"Aman",
    to:"Mohit",
    msg:"We can have fun later..",
    created_at:new Date(),
}
]
Chat.insertMany(chats);