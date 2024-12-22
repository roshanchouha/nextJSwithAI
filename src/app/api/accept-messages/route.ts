import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/options'
import dbConnect from '@/lib/dbConnection'
import UserModel from '@/model/User'
import {User} from "next-auth";


export async function POST(request : Request) {
     await dbConnect();

     const session = await getServerSession(authOptions)
     const  user: User = session?.user as User;

     if(!session || !session.user){
        return Response.json(
            {
                success: false,
                message: 'Unauthorized'
            },
            {
                status: 401
            }
        )
     }

     const userID = user._id;
     const {acceptMessages} =await request.json()
    
     try{
        const updatedUser =  await UserModel.findByIdAndUpdate(
             userID,
             {isAcceptingMessage : acceptMessages},
             {new: true}
         )

          if(!updatedUser){
                return Response.json({
                    success: false,
                    message: 'failed to update user status to accept message'
                },{
                    status: 401
                })
           }

           return Response.json({
            success: true,
            message: 'User status updated successfully'
            },{
             status: 200
            })
     }catch(err){
        console.log(" failed to update user status to accept message  ")
        return Response.json({
            success: false,
            message: 'Failed to update user status'
        },{
            status: 500
        })
     }
     
     
 }


export async function GET(request : Request) {
    await dbConnect();

    const session = await getServerSession(authOptions)
    const  user: User = session?.user as User;

    if(!session || !session.user){
       return Response.json(
           {
               success: false,
               message: 'Unauthorized'
           },
           {
               status: 401
           }
       )
    }

    const userID = user._id;

     try{
        const userFound = await UserModel.findById(userID)

        if(!userFound){
            return Response.json({
                success: false,
                message: 'user not found'
            },{
                status: 404
            })
        }

        return Response.json({
            success: true,
            isAcceptingMessage: userFound.isAcceptingMessage,
            message: 'User found'
        },{
            status: 200
        })

     }catch(err){
        return Response.json({
            success: false,
            message: 'user not found'
        },{
            status: 500
        })
     }
 }