import dbConnect from "@/lib/dbConnection";
import {z} from "zod"
import UserModel from "@/model/User";
import { Resolver } from "dns";


export async function POST(request: Request){
     await dbConnect();
     

     try{
        const {username ,code } =   await request.json()
        const decodedUserName = decodeURIComponent(username)
        const user = await UserModel.findOne({username: decodedUserName})
        if(!user){
            return Response.json({
                success: false,
                message: 'User not found'
            },{
                status: 404
            })
         }
         
        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeValid && isCodeNotExpired){
             user.isVerified = true
              await user.save()

              return Response.json({
                  success: true,
                  message: 'Code verified successfully'
              },{
                  status: 200
              })
        }else if(!isCodeNotExpired){
            return Response.json({
                success: false,
                message: 'Code expired please sign again'
            },{
                status: 400
            })
        } else {
             return Response.json({
                    success: false,
                    message: 'Invalid code'
                },{
                    status: 400
                })
        }

      }catch(error){
         console.error("Error in verify code",error)
         return Response.json({
             success: false,
             message: 'Error verifying code'
         },{
             status: 500
         })
     }
}