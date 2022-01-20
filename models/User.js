const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique:true,
        lowercase: true
    },
  image:{
      type: String,
      required: true
  },
  fullName:{
      type: String,
      required: true
  },
  accountId:{
      type: String,
      required: true
  },
  firstName:{
      type: String,
      required: true
  },
  lastName: {
      type: String,
      required: true
  },
  middleName: {
      type:String
  },


})
const User= mongoose.model('user',userSchema)
module.exports = User