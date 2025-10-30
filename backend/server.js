import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Database from "better-sqlite3";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// DB SQLite
const db = new Database("./database.db");

// Tabla
db.prepare(`
  CREATE TABLE IF NOT EXISTS searches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    term TEXT,
    sprite TEXT,
    date TEXT
  );
`).run();

// Guardar búsqueda
app.post("/api/search", (req, res) => {
  const { searchTerm, sprite } = req.body;
  if (!searchTerm || !sprite) {
    return res.status(400).json({ error: "searchTerm y sprite requeridos" });
  }

  db.prepare("INSERT INTO searches (term, sprite, date) VALUES (?, ?, ?)")
    .run(searchTerm, sprite, new Date().toISOString());

  res.json({ message: "Búsqueda guardada" });
});

// Listar
app.get("/api/search", (req, res) => {
  const rows = db.prepare("SELECT * FROM searches ORDER BY date DESC").all();
  res.json(rows);
});

app.listen(PORT, () =>
  console.log(`Backend escuchando en http://localhost:${PORT}`)
);
