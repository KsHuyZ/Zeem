const socket = io("/")
const videoGrid = document.getElementById("video-grid")
const peer = new Peer(undefined, {
  path: "peerjs",
  host: "/",
  port: "433",
})

let peerId
const profile = {
  userId,
  userImage,
  userName
}
socket.on('error-room',()=>{
  window.location.replace(`/wrong`)
})



const myVideo = document.createElement("video")
myVideo.muted = true

peer.on("open", (id) => {
  
  
   socket.emit("join-room", ({roomId:ROOM_ID,profile,idpeer:id}))
   socket.on('list-user',(result)=>{
 console.log(result)
    let value = result[result.length-1]
    result.pop(result[result.length-1])
    result.unshift(value)
  setTimeout(()=>{
    const videos = document.getElementsByTagName("video")
  console.log(videos.length)
  
  for(let i =0; i< videos.length;i++){
    videos[i].setAttribute('id',result[i])
  }

  },3000)
  })
 })


let myVideoStream
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  }).then(stream => {
    myVideoStream = stream
    addVideoStream(myVideo, stream)
    peer.on("call", (call) => {
     
      call.answer(stream) // Answer the call with an A/V stream.
      const video = document.createElement("video")
    
      call.on("stream", userVideoStream => {
        addVideoStream(video, userVideoStream)
      })
    })

    socket.on("user-connected", ({userId,idpeer}) => {
     
     setTimeout(()=>{
      connectToNewUser(idpeer, stream)
     },1000)
     console.log(idpeer)
    
    })
  })
  .catch((error)=>{
    console.log(error)
  })


socket.on('user-disconected', (userpeerId) =>{
  console.log('someone dis conect',userpeerId)
  
 document.getElementById(`${userpeerId}`).remove()
})

const addVideoStream = (video, stream) => {
 
  video.srcObject = stream
  video.addEventListener("loadedmetadata", () => {
    video.play()
  })
  

  videoGrid.append(video)
}

const connectToNewUser = (userId, stream) => {
  console.log('New user conected',userId)

  const call = peer.call(userId, stream)
  const video = document.createElement("video")
  
  video.setAttribute('id',userId)
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream)
  })
}


const input = document.querySelector('#chat_message')
input.addEventListener('keyup',(e)=>{
if(e.keyCode==13 &&input.value.length !==0){
socket.emit('send-message',input.value)
input.value=""
}
})




socket.on('get-message',data=>{
 
  if(profile.userId!==data.idUser){
    console.log(profile.userId)
    console.log(data.idUser)
    // console.log(socket.id)
    // console.log(data.socketId)
    const messageList = document.querySelector('.messages')
    messageList.insertAdjacentHTML('beforeend',"<div class='seener'><div class='profile'> <img src='"+data.urlImage+"'/> </div> <div class='seen'>  <div class='name'>"+data.userName+"</div>   <span class='messagez'>"+data.message+"</span></div></div>")
    scrollToBottom()
  }
  else{
    
    console.log('sender-seen this')
    const messageList = document.querySelector('.messages')
    messageList.insertAdjacentHTML('beforeend',"<div class='sender'><span>"+data.message+"</span></div>")
    scrollToBottom()
  }
})
const scrollToBottom = ()=>{
  const d = document.querySelector('.main__chat_window')
  d.scrollTo(0,document.body.scrollHeight)
}

const muteUnmuted =document.querySelector('.main__mute_button')
muteUnmuted.addEventListener('click',()=>{
  let enabled = myVideoStream.getAudioTracks()[0].enabled
  if(enabled){
    myVideoStream.getAudioTracks()[0].enabled = false
    setUnmuteButton()
    console.log('isEnable')
  }
  else{
    setMuteButton()
    myVideoStream.getAudioTracks()[0].enabled = true
    console.log('isUnEnable')
  }
})

const setMuteButton=()=>{
const html = `
<i class='fas fa-microphone icon'></i>`
document.querySelector('.main__mute_button').innerHTML= html
}
const setUnmuteButton=()=>{
  const html = `<i class='fas fa-microphone-slash icon-close'></i>
 `
  document.querySelector('.main__mute_button').innerHTML= html
}
const playStop = document.querySelector('.main__stop_video')
playStop.addEventListener('click',()=>{
  let enabled = myVideoStream.getVideoTracks()[0].enabled
  if(enabled){
    console.log('is offf')
    myVideoStream.getVideoTracks()[0].enabled= false
    setStopPlay()
  }else{
    console.log('ison')
    myVideoStream.getVideoTracks()[0].enabled= true
    setContinousPlay()
  }
})
const setStopPlay = ()=>{
  const html = `  <i class='fas fa-video-slash icon-close'></i>`
  document.querySelector('.main__stop_video').innerHTML= html
}
const setContinousPlay = ()=>{
  const html =` <i class='fas fa-video icon'></i>`
  document.querySelector('.main__stop_video').innerHTML= html
}