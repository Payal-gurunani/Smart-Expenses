import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config()
export const genrateToken = (userId) =>{
   const t =  jwt.sign({_id:userId} ,process.env.JWT_SECRET,{
        expiresIn:"2hr",
    })
    // console.log(t,"From genrate");
    return t;
    
    
}