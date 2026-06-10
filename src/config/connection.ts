import mongoose from "mongoose";


let dbConnection = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL!)
        console.log("mongo is connected");
    } catch (error) {
        console.log(error);
    }
}

export default dbConnection