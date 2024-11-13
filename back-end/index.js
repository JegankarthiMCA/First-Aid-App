import express from "express";
import "dotenv/config";
import bodyParser from "body-parser";
import cors from "cors";
import  "./Config/dbConfig.js";
import authRoutes from "./Router/auth.js"
import adminRoutes from "./Router/admin.js"
import studentRoutes from "./Router/student.js"
const app = express();
const PORT = process.env.port || 8080;

app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
// db;

app.patch("/", (req, res) => {
  res.status(200).send("working");
});

app.listen(PORT, () => {
  console.log(`Server running on port : http://localhost:${PORT}`);
});
