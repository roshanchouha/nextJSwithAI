import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/User";
import {Message} from "@/model/User";

export async function POST(request : Request){
     await dbConnect();

     const {username, content } = await request.json()

     try{
         const user = await UserModel.findOne({username})
         if(!user){
            return Response.json({
                success : false,
                message : 'not Authenticated'
            },{status : 401})
         } 
         //is user accepting message

         if(!user.isAcceptingMessage){
            return Response.json({
                success : false,
                message : 'User is not accepting messages'
            },{status : 403})
         }
         const newMessage = { content ,createdAt: new Date()}
            user.messages.push(newMessage as Message)
            await user.save()
            
            return Response.json({
                success : true,
                message : 'Message sent successfully'
            },{status : 200})
     }catch(err){
            console.log("Error in sending message",err)
            return Response.json({
                success : false,
                message : 'Error in sending message'
            },{status : 500})
      }

}