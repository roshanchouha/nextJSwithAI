import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnection";
import bcrypt from "bcrypt"
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";



export async function POST( request: Request){
     await dbConnect();

     try{
        const {username , email , password} = await request.json();
        
        const existingUserVerifiedByUsername = await UserModel.findOne({username , isVerified:true})
        if(existingUserVerifiedByUsername){
             return Response.json({
                 success: false,
                 message: 'User already registered with this username'
             },{
                 status: 400
             })
        }

        const existingUserByEmail = await UserModel.findOne({email});
        const verifyCode = Math.floor(10000 + Math.random() * 90000).toString();
        if(existingUserByEmail){
             if(existingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: 'User already registered with this username'
                },{
                    status: 400
                })
              }else{
                  const hasedPassword = await bcrypt.hash(password,10)
                  existingUserByEmail.password = hasedPassword
                  existingUserByEmail.verifyCode = verifyCode;
                 existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 36000000) 
                 
                 console.log("existingUserByEmail",existingUserByEmail)
                  await existingUserByEmail.save()
              }
        }else{
          const hasedPassword = await bcrypt.hash(password ,10)
          const expiryDate = new Date()
           expiryDate.setHours(expiryDate.getHours() + 1);

         const newUser =  new UserModel({
            username,
            email,
            password:  hasedPassword,
            verifyCode,
            verifyCodeExpiryDate: expiryDate,
            isAcceptingMessage: true,
            isVerified: false,
            messages: [],
            
           })
           console.log("new user",newUser, "expiration time ", expiryDate)
           await newUser.save()
          }
        //send verification 


        const emailResponse = await sendVerificationEmail(email, username, verifyCode)
       if(!emailResponse.success){
        return Response.json({
             success : false,
             message: emailResponse.message
        },{
            status: 500
        })
       }
       return Response.json({
        success : true,
        message: "user register successfully"
       },{
         status: 201
      })
 
       }catch(err){
        console.log("error registering user", err);
        return Response.json({
             success: false,
             message: 'error registering user'
        },{
            status: 500
        })
     }
}