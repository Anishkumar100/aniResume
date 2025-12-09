import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },

  email:{
    type:String,
    required:true,
    unique:true
  },

  password:{
    type:String,
    required:true
  },



},{timestamps:true});


// using a schema method to compare the password while login of the users

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password,this.password);
}

// creating the model
const User = mongoose.model('User',userSchema);

export default User;