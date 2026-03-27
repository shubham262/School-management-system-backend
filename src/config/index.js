import mongoose from "mongoose";

export const handleMongoDbConnection = async () => {
	try {
		mongoose.connect("mongodb://127.0.0.1:27017/school_management");
		console.log("Database connection successfull");
	} catch (error) {
        console.log("Database connection failed,error==>", error);
    }
};
