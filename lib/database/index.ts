import mongoose from "mongoose";

//chech if we already have a connection to the database


let cached = (global as any).mongoose || { conn: null, promise: null };


export const connectToDatabase = async () => {
    const MONGODB_URI = process.env.MONGODB_URI;
    console.log("starting connection to database")
    console.log(MONGODB_URI)
    if (cached.conn) {
        console.log("found cached connection")
        return cached.conn;
    }
    if (!MONGODB_URI)
        throw new Error(
            "Please define the MONGODB_URI environment variable inside .env.local"
        );

    cached.promise = cached.promise || await mongoose.connect(MONGODB_URI, {
        dbName: "mimoni",
        bufferCommands: false,
    });

    cached.conn = await cached.promise;

    return cached.conn;
}
