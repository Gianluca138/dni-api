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

// Puerto de Render o 3000 si es local
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`API iniciada en el puerto ${PORT}`);
});