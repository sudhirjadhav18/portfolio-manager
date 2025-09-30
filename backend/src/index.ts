import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./modules/auth/auth.routes";
import screenerRoutes from "./modules/screener/screener.routes";
import zerodhaRoutes from "./modules/zerodha/zerodha.routes";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173", // Vite dev server
  credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/screener", screenerRoutes);
app.use("/api/zerodha", zerodhaRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
