const { createCanvas, loadImage } = require("@napi-rs/canvas");
const fs = require("fs");
const path = require("path");

async function generateDNI(data) {

    // Plantilla
    const fondo = await loadImage(
        path.join(__dirname, "../templates/dni-distrito.png")
    );

    const canvas = createCanvas(fondo.width, fondo.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(fondo, 0, 0);

    // Avatar desde tu API
    const foto = await loadImage(
        `http://localhost:3000/avatar/${data.robloxId}`
    );

    const POS = {
        foto: {
            x: 30,
            y: 245,
            w: 400,
            h: 420
        },

        apellido: {
            x: 455,
            y: 220
        },

        nombre: {
            x: 455,
            y: 365
        },

        sexo: {
            x: 405,
            y: 520
        },

        nacionalidad: {
            x: 560,
            y: 520
        },

        nacimiento: {
            x: 930,
            y: 520
        },

        documento: {
            x: 90,
            y: 710
        },

        emision: {
            x: 455,
            y: 705
        },

        vencimiento: {
            x: 820,
            y: 705
        }
    };

    // Dibujar foto
    ctx.drawImage(
        foto,
        POS.foto.x,
        POS.foto.y,
        POS.foto.w,
        POS.foto.h
    );

    // Fechas automáticas
    const hoy = new Date();

    const emision = hoy.toLocaleDateString("es-AR");

    const vencimiento = new Date(hoy);
    vencimiento.setFullYear(vencimiento.getFullYear() + 4);

    const vencimientoTexto = vencimiento.toLocaleDateString("es-AR");

    ctx.fillStyle = "#111";
    ctx.textBaseline = "top";

    // Apellido
    ctx.font = "bold 42px Arial";
    ctx.fillText(data.apellido, POS.apellido.x, POS.apellido.y);

    // Nombre
    ctx.fillText(data.nombre, POS.nombre.x, POS.nombre.y);

    // Sexo
    ctx.font = "bold 34px Arial";
    ctx.fillText(data.sexo, POS.sexo.x, POS.sexo.y);

    // Nacionalidad
    ctx.fillText(data.nacionalidad, POS.nacionalidad.x, POS.nacionalidad.y);

    // Fecha de nacimiento
    ctx.fillText(data.nacimiento, POS.nacimiento.x, POS.nacimiento.y);

    // Documento
    ctx.font = "bold 48px Arial";
    ctx.fillText(data.documento, POS.documento.x, POS.documento.y);

    // Emisión
    ctx.font = "bold 34px Arial";
    ctx.fillText(emision, POS.emision.x, POS.emision.y);

    // Vencimiento
    ctx.fillText(vencimientoTexto, POS.vencimiento.x, POS.vencimiento.y);

    // Guardar imagen
    const salida = path.join(
        __dirname,
        `../public/dnis/${data.documento}.png`
    );

    fs.writeFileSync(salida, canvas.toBuffer("image/png"));

    return `/dnis/${data.documento}.png`;
}

module.exports = generateDNI;