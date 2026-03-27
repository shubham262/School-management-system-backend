import { MongoClient } from "mongodb";
import mongoose from "mongoose";

const MONGO_URI = "mongodb://127.0.0.1:27017/school_management";

let cachedConnection = null;
export const handleMongoDbConnection = async () => {
	try {
		if (cachedConnection) {
			return cachedConnection;
		}
		await mongoose.connect(MONGO_URI);
		const client = new MongoClient(MONGO_URI);
		await client.connect();
		const db = client.db("school_management");
		console.log("Database connection successfull");
		cachedConnection = { client, db };
		return cachedConnection;
	} catch (error) {
		console.log("Database connection failed,error==>", error);
	}
};
