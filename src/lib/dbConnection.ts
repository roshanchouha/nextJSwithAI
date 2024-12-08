import mongoose from "mongoose";

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
      const db =  await mongoose.connect(process.env.MONGODB_URL || '' ,{}) 
       console.log("db,connection", db, db.connections)
       connection.isConnected = db.connections[0].readyState;

   }catch (err) {
       console.log(err," error in db connection ");
       process.exit(1)
        
  }

}

export default dbConnect;