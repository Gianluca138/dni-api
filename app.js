const axios = require("axios");
const express = require("express");
const cors = require("cors");
const path = require("path");

const dniRoutes = require("./routes/dni");
const avatar = require("./routes/avatar");

const app = express();

app.use(cors());
app.use(express.json());

// Carpeta pública
app.use("/dnis", express.static(path.join(__dirname, "public/dnis")));

// Rutas
app.use("/api/dni", dniRoutes);
app.use("/avatar", avatar);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`API iniciada en http://localhost:${PORT}`);
});