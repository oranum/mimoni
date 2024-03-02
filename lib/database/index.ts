'use server'

import mongoose from "mongoose";

//chech if we already have a connection to the database


let cached = (global as any).mongoose || { conn: null, promise: null };


export const connectToDatabase = async () => {
    const MONGODB_URI = "mongodb+srv://oranlimony:Burgata1@cluster0.russcec.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    console.log("starting connection to database")
    console.log(MONGODB_URI)
    if (cached.conn) {
        console.log("found cached connection")
        return cached.conn;
    }
    if (!MONGODB_URI)
        throw new Error(
            "from connectToDatabase: MONGODB_URI is undefined"
        );

    cached.promise = cached.promise || await mongoose.connect(MONGODB_URI, {
        dbName: "mimoni",
        bufferCommands: false,
    });

    cached.conn = await cached.promise;

    return cached.conn;
}
