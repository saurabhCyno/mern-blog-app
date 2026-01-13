import mongoose from "mongoose";

const connectDB = async () : Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log(`MongoDB Atlas Connected! : ${mongoose.connection.host}`);
    } catch (error : any) {
        console.error(`MongoDB Connection failed! : ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;