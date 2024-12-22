import dbConnect from "@/lib/dbConnection";
import UserModel from "@/model/User";
import {z} from  "zod"
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username:usernameValidation
})

export async function GET(request : Request) {
    if(request.method !== 'GET'){
      return Response.json({
         success: false,
         message : 'Method not allowed'
      },{
         status: 405
      })
    }
     await dbConnect();
     try{
         const { searchParams } = new URL(request.url);


         const queryParam = {
             username : searchParams.get('username')
         }

         //validation for username
          const result = UsernameQuerySchema.safeParse(queryParam)

          console.log("result ",result)
          if(!result.success){
             const usernameError = result.error.format().username?._errors || []
             return Response.json({
                 success: false,
                 message : usernameError?.length > 0 ? usernameError.join(',') : 'Invalid query'
             },{
                status: 400
             })
          }
          const {username} = result.data 
         const existingUserVerified = await  UserModel.findOne({username, isVerified:true})

          if(existingUserVerified){
             return Response.json({
                success: false,
                message : 'username is already taken'
            },{
               status: 400
            })
          }
          
          return Response.json({
            success: true,
            message : 'Username is unique',
          }, {status : 200})
     }
     catch(error){
         console.error("Error checking username",error)
         return Response.json({
            success: false,
            message : "Error checking username"
         },
        {status: 500})
     }
}