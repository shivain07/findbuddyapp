import mongoose from "mongoose";

export async function connect() {
    try {
        mongoose.connect(process.env.MONGO_URI!);
        const connection=mongoose.connection;

        connection.on('connected',()=>{
            console.log("Mongo connected")
        }) 
        connection.on('error',(err)=>{
            console.log("Error mongodb connection",err);
            process.exit();
        }) 
    } catch (error) {
        console.log("something went wrong")
        console.log(error)
    }
}