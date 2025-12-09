import User from "../models/user.js";
import bcrypt from "bcryptjs";
import generateToken from "../config/generateToken.js";

//controller for user registration
//POST: /api/users/register
export const registerUser = async(req, res) => {
  try 
  {
     const { name, email, password } = req.body;

     // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const genSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, genSalt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    //token generation function called here
    const userToken=generateToken(newUser._id);
    newUser.password=undefined;  //hiding password from response

    //success response
    return res.status(201).json({message: 'User registered successfully', user: newUser,token:userToken });

    
  } 
  catch (error) 
  {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}



//controller for user login
//POST: /api/users/login
export const userLogin = async(req, res) => {
  try 
  {
     const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

     // Check if user exists
    const existingUser = await User.findOne({ email });


    if (!existingUser) {
      return res.status(400).json({ message: `Invalid Email or Password` });
    }
    // password comparison function is inbuilt in user model as a schema method
    if ( !existingUser.comparePassword(password)) {
      return res.status(400).json({ message: `Invalid Password or Email` });
    }

    const token=generateToken(existingUser._id);
    existingUser.password=undefined; //hiding password from response
    return res.status(200).json({message:`Login Successful`, user: existingUser,token });

  } 
  catch (error) 
  {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
} 


// NOTE
//controller for getting user by id (from req.userId populated by auth middleware)
//GET: /api/users/data

export const getUserById = async(req, res) => {
  try 
  {
     const userId = req.userId; // courtesy of userMiddleware

     const user = await User.findById(userId).select('-password'); // Exclude password from the result
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ user });
  }
    catch (error)
    {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}