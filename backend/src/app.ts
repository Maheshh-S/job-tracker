import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import testRoutes from "./routes/testRoutes";
import applicationRoutes from "./routes/applicationRoutes";



const app = express();

app.use(
  cors({
    origin: "*", // we restrict later if needed
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/health", (req, res) => {
    res.status(200).json({ message: "API is running--LETS GOOO" });
});

app.use("/api/test", testRoutes);

app.use("/api/applications", applicationRoutes);


export default app;