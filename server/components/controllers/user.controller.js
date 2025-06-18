import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import {User} from "../models/User.model.js"
import { genrateToken } from "../utils/genrateToken.js";
const Register = asyncHandler(async(req,res)=>{
const {username , email, password} = req.body;
if([username ,email ,password ].some((field)=>field?.trim() ==="")){
    throw new ApiError(400,"All fields are required")
}
const existuser = await User.findOne({
  $or: [{ email }]
});

if(existuser){
    throw new ApiError(409 , "User with this mail address is already exist")
}


if(!password || password.trim() ===""){
    throw new ApiError(400,"Password required")
}

const user = await User.create({
    username,email,password
})

const createduser = await User.findById(user._id).select('-password');
if(!createduser){
     throw new ApiError(500,"User not created")
}


 return res
    .status(201)
    .json(
        new ApiResponse(201,createduser,"Registraion successfull")
)
})

const loginUser = asyncHandler(async (req,res)=>{
const {email , password} = req.body;
if (!email || !password) {
    throw new ApiError(400, "Email and Password is required")
  }

  const user = await User.findOne({email});
  if(!user) throw new ApiError(400,"User not found")
const passwordMatch = await user.matchPassword(password);
  if(!passwordMatch){
    throw new ApiError(401,"Invalid password")
  }

  const userLogin  = await User.findById(user._id).select("-password")
  const token =  genrateToken(user._id);
  const options = {
    httpOnly:true,
    secure:process.env.NODE_ENV == 'production',
    sameSite:"strict"
  }
  res.cookie("token",token,options)
  return res
  .status(200)
  .json(
    new ApiResponse(200,{
        token,
        user:userLogin,
    },"Successfully login")
  )

})

const logoutUser = asyncHandler(async (req , res)=>{
res.clearCookie('token',{
    httpOnly:true,
    secure:process.env.NODE_ENV == 'production',
    sameSite:"strict",
    path:'/'
})
return res.status(200).json(new ApiResponse(200, {}, "User logout Successfully"))
})
export {Register,loginUser,logoutUser}