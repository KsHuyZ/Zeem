const socket = io("/");
// console.log(idUser)
    const codeJoin = document.querySelector('.join-code')
const joinSubmit = document.querySelector('.join-room')
const createRoom = document.querySelector('.create button')
const makeRoomId = ()=>{
    let result = ''
    const character = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const characterLength = character.length
    for(let i = 0; i<9;i++){
        result += character.charAt(Math.floor(Math.random() * 
        characterLength));
    }
    return result;
}
$('.join-code').keyup(()=>{
    joinSubmit.style.display ='block'
    if(codeJoin.value.length!==0){
       joinSubmit.style.color='#0099ff'
    }else{
        joinSubmit.style.display ='none'
        joinSubmit.style.color='#adadad'
    }
   
})


$('join-code').keydown(()=>{
    if(codeJoin.value.length===0){
            joinSubmit.style.display ='none'
        }
})
createRoom.addEventListener('click',()=>{
    
    const roomId = makeRoomId()
   socket.emit('create-room',(roomId))
 
    window.location.replace(`/${roomId}`)
})
