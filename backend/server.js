import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import Database from "better-sqlite3";

const app = express();
app.use(cors());
app.use(express.json());

// Crear carpeta "data" si no existe
const dataDir = path.resolve("./data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
  console.log("Carpeta 'data' creada para la base de datos");
}

// Ruta de la base de datos
const dbPath = path.join(dataDir, "database.db");

// Conexión a la base de datos
const db = new Database(dbPath);

// Crear tabla si no existe
db.prepare(`
  CREATE TABLE IF NOT EXISTS searches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    term TEXT,
    sprite TEXT,
    types TEXT,
    abilities TEXT,
    date TEXT
  )
`).run();

console.log("Tabla 'searches' verificada correctamente");

// Rutas API
app.post("/api/search", (req, res) => {
  const { searchTerm, sprite, types, abilities } = req.body;
  const date = new Date().toISOString();
  db.prepare(
    "INSERT INTO searches (term, sprite, types, abilities, date) VALUES (?, ?, ?, ?, ?)"
  ).run(searchTerm, sprite, types, abilities, date);
  res.json({ message: "Guardado correctamente" });
});

app.get("/api/search", (req, res) => {
  const rows = db.prepare("SELECT * FROM searches ORDER BY id DESC").all();
  res.json(rows);
});

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Servidor escuchando en http://localhost:${PORT}`)
);
