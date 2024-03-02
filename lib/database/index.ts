import mongoose, { Connection } from 'mongoose';

(global as any).mongoose = (global as any).mongoose || { conn: null, promise: null } as { conn: Connection | typeof import("mongoose") | null; promise: Promise<Connection> | Promise<typeof import("mongoose")> | null; }

let cached = global as any

export const connectToDatabase = async () => {
    const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://oranlimony:Burgata1@cluster0.russcec.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    console.log("Starting connection to database");
    console.log(MONGODB_URI);

    if (cached.conn) {
        console.log("Found cached connection");
        return cached.conn;
    }

    if (!MONGODB_URI) {
        throw new Error("MONGODB_URI is undefined");
    }

    try {
        cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
            dbName: "mimoni",
        });

        cached.conn = await cached.promise;

        return cached.conn;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
};
