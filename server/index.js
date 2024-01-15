import connectDB from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./src/app.js";
dotenv.config();
const PORT = process.env.PORT || 8000;
connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERRR:", error);
      throw error;
    });
    app.listen(PORT, () => {
      console.log(`Server is Listening on PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`mongodb  faild error`, err);
  });
