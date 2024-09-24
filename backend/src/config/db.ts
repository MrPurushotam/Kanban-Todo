import mongoose from "mongoose";
import "dotenv/config";

type ConnectionObject= {
    isConnected?:number
}

const connection:ConnectionObject={}

export async function dbConnect(){
    const connectionString= process.env.MONGOURL as string;
    try {
        const db = await mongoose.connect(connectionString || "");
        connection.isConnected= db.connections[0].readyState;
        console.log("Db connected")
    } catch (error:any) {
        console.log("Error occured while connecting db ",error.message)
        process.exit(1);
    }
}
