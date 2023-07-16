import mongoose from "mongoose";
import { MONGODB } from "./env";

try {
  const mongoUri: string =
    "mongodb://" +
    MONGODB.USERNAME +
    ":" +
    MONGODB.PASSWORD +
    "@" +
    MONGODB.URL +
    ":" +
    MONGODB.PORT +
    "/?retryWrites=true&w=majority";
  mongoose.connect(mongoUri, { dbName: MONGODB.NAME });
  console.log("Connected to MongoDB: " + MONGODB.URL + ":" + MONGODB.PORT);
} catch (error) {
  let errorMessage = "MongoDB Error";
  if (error instanceof Error) {
    errorMessage = error.message;
  }
  console.log(errorMessage);
}
