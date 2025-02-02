import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

type ConnectionObject = {
  isConnected?:number 
}

const connection:ConnectionObject = {}

  async function dbConnect(): Promise<void> {

     if(connection.isConnected){
         console.log('Already connected to the database.');
         return;
     }

   try {
      console.log(" process.env.MONGODB_URL=====>",process.env.MONGODB_URL)
      const db =  await mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/newData' , {} ) 
      //  console.log("db connection", db.connections)
       connection.isConnected = db.connections[0].readyState;

   }catch (err) {
       console.log(err," error in db connection ");
       process.exit(1)
        
  }

}

export default dbConnect;