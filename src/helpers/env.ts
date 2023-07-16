import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const MONGODB = {
  URL: process.env.MONGODB_URL,
  PORT: process.env.MONGODB_PORT,
  USERNAME: process.env.MONGODB_USERNAME,
  PASSWORD: process.env.MONGODB_PASSWORD,
  NAME: process.env.MONGODB_NAME,
};
