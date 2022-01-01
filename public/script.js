const videoGrid = document.getElementById("video-grid");
const socket = io("/");

const myVideo = document.createElement("video");
myVideo.muted = true;

const peer = new Peer(undefined, {
  path: "peerjs",
  host: "/",
  port: "443",
});

let myVideoStream;
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);


    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });
  });

peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});
peer.on("call", (call) => {
  call.answer(myVideoStream ); // Answer the call with an A/V stream.
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
});
const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};

const connectToNewUser = (userId, stream) => {
  console.log(userId);

  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
};

const input = document.querySelector('#chat_message');
input.addEventListener('keyup',(e)=>{
if(e.keyCode==13 &&input.value.length !==0){
socket.emit('send-message',input.value)
input.value=""
}
})




socket.on('get-message',data=>{
 
  if(socket.id!==data.socketId){
    console.log(socket.id)
    console.log(data.socketId)
    const messageList = document.querySelector('.messages')
    messageList.insertAdjacentHTML('beforeend',"<div class='seen'><span>"+data.message+"</span></div>")
    scrollToBottom()
  }
  else{
    console.log(socket.id)
    console.log(data.socketId)
    console.log('sender-seen this')
    const messageList = document.querySelector('.messages')
    messageList.insertAdjacentHTML('beforeend',"<div class='sender'><span>"+data.message+"</span></div>")
    scrollToBottom()
  }
})
const scrollToBottom = ()=>{
  const d = document.querySelector('.main__chat_window')
  d.scrollTo(0,document.body.scrollHeight);
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
document.querySelector('.main__mute_button').innerHTML= html;
}
const setUnmuteButton=()=>{
  const html = `<i class='fas fa-microphone-slash icon-close'></i>
 `
  document.querySelector('.main__mute_button').innerHTML= html;
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