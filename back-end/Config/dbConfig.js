import mongoose from "mongoose";
import "dotenv/config";
   
mongoose.Promise = global.Promise;


mongoose
  .connect(process.env.DBCONNECTION, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log("Connected to the database successfully");
  })
  .catch((err) => {
    console.log(err);
    process.exit();
  })
