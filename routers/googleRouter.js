const express = require('express')
const ggRouter = express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')
require('../passport-setup.js')
const User = require('../models/User.js')
const isLoggedin = (req,res,next)=>{
    if(req.user){
        next()
        // res.json(req.user)
    }else{
        res.send('error')
    }
}

ggRouter.get('/n',(req,res)=>{
  res.send('You are not log in')
})
ggRouter.get('/good',isLoggedin, async(req,res)=>{
try { 
  let user
  if( user = await User.find({email:req.user.emails[0].value})){
    console.log(req.user.displayName)
 res.redirect('/')
    //  res.send(user)

 
// const user = User.findOne({email:req.user.emails[0].value})
// res.json(user)
} else{
    user =await User.create({
      email:req.user.emails[0].value,
      image:req.user.photos[0].value,
      fullName:req.user.displayName,
      accountId: req.user.id,
      firstName: req.user.name.givenName,
      lastName:req.user.name.familyName,
      middleName: req.user.middleName
    })
 
    //  res.send(user)
    res.redirect('/')
  }
 
} catch (error) {
  console.log(error.message)
}
})
ggRouter.get('/google',
  passport.authenticate('google',{ scope: ['profile','email'] }));

ggRouter.get('/google/callback', 
  passport.authenticate('google', {failureRedirect: '/failed',

  }),
  function(req,res){
    
    res.redirect('/')
  }
  );
ggRouter.get('/logout',(req,res)=>{
    req.session=null
    req.logout()
    res.redirect('/login/n')
})
  module.exports = ggRouter;