const express = require('express')
const callRouter = express.Router()
const server = require('http').Server(express)
const io = require('socket.io')(server)
callRouter.get('/',(req,res)=>{
// res.render('home')
res.render('home',{user:req.user})
}   )
callRouter.get('/wrong',(req, res)=>{
   res.render('notexits')
})
callRouter.get('/:room',(req,res)=>{
//   req.app.io.emit('check-exists',req.params.room)
  
        res.render('room',{roomId:req.params.room,
                            user:req.user})
    
        // res.render('notexits')
     
       
        
   
  
   
})

module.exports = callRouter;