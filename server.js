const express = require("express")
const { ExpressPeerServer } = require("peer")
const app = express()
const cookieParser = require("cookie-parser")
const callRouter = require("./routers/callRouter.js")
const ggRouter = require("./routers/googleRouter.js")
const paypalRouter = require("./routers/paypalRouter.js")
require("dotenv").config()
const cookieSession = require("cookie-session")
const mongoose = require("mongoose")

// const { v4: uuidv4 } = require('uuid')
// uuidv4()
const server = require("http").Server(app)
const io = require("socket.io")(server)
const passport = require("passport")
const peerServer = ExpressPeerServer(server, {
  debug: true,
})

app.use(
  cookieSession({
    secret: "Huyyyyyyyyy",
    resave: false,
    saveUninitialized: false,
  })
)

app.use(passport.initialize())
app.use(passport.session())
app.use("/peerjs", peerServer)
app.set("view engine", "ejs")

app.use(express.static("public"))
app.use(cookieParser())
app.use("/paypal",paypalRouter)
app.use("/login", ggRouter)
app.use("/", callRouter)


const PORT = process.env.PORT
server.listen(PORT || 3000, () => {
  console.log("Server start on port " + PORT)
})
//reload page will clear all socket, so Huyyy use array to save all room :D you can save it in Database but I think array is better :(
const listRoom = []
let peerRoomId = []
io.on("connection", (socket) => {
  socket.on("join-room", ({ roomId, profile, idpeer }) => {
    console.log("room id", roomId)
    console.log("join", listRoom)

    peerRoomId.push({ idpeer, roomId })
    socket.join(roomId)
    console.log("list room:", listRoom)
    console.log("peer room id:", peerRoomId)
    let peerthisroom = peerRoomId.filter((item) => item.roomId === roomId)
    let result = peerthisroom.map((a) => a.idpeer)
  socket.emit('list-user',result)
    


    if (listRoom.indexOf(roomId) !== -1) {
     
    


      io.to(roomId).emit("user-connected", ({ userId: profile.userId, idpeer }))
      console.log(`all peer in ${roomId}`, result)
      socket.on("send-message", (message) => {
        console.log("get socket emit")

        io.to(roomId).emit("get-message", {
          message,
          idUser: profile.userId,
          urlImage: profile.userImage,
          userName: profile.userName,
        })
      })
      socket.on("disconnect", () => {
        console.log(roomId)
        peerRoomId.pop({roomId})
        console.log("all peer",peerRoomId)
        if (!io.sockets.adapter.rooms.has(roomId)) {
          listRoom.pop(roomId)
          console.log("all room", listRoom)
         
        }
        console.log(profile.userName, " is out the room")
        socket.broadcast.to(roomId).emit("user-disconected", idpeer)
      })
    } else {
      console.log("room is not exist" + listRoom)
      socket.emit("error-room")
    }
  })
  socket.on("create-room", (roomId) => {
    console.log(roomId)
    listRoom.push(roomId)
    console.log("create ", listRoom)
  })
})

mongoose
  .connect("mongodb+srv://kshuyz:kshuyz0055@cluster0.qd1uf.mongodb.net/Zeem?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connect succes")
  })
  .catch((error) => {
    console.log(error.message)
  })
