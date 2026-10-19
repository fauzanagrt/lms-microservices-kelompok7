
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./config/database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mengecek status server
app.get("/health", (req, res) => {
  res.status(200).json({
    service: "users-auth-service",
    status: "healthy",
    message: "Auth Service berhasil dijalankan",
  });
});

// Mengecek koneksi PostgreSQL
app.get("/db-health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS waktu");

    res.status(200).json({
      status: "healthy",
      database: "users_db",
      message: "Koneksi PostgreSQL berhasil",
      waktu: result.rows[0].waktu,
    });
  } catch (error) {
    console.error("Database error:", error.message);

    res.status(500).json({
      status: "error",
      message: "Koneksi PostgreSQL gagal",
    });
  }
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Auth Service berjalan di http://localhost:${PORT}`);
});

