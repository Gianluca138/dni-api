const { createCanvas, loadImage } = require("@napi-rs/canvas");
const fs = require("fs");
const path = require("path");

async function generateDNI(data) {
    console.log("========== GENERANDO DNI ==========");
    console.log(data);

    // Plantilla
    const plantilla = path.join(__dirname, "../templates/dni-distrito.png");
    console.log("Plantilla:", plantilla);

    const fondo = await loadImage(plantilla);

    const canvas = createCanvas(fondo.width, fondo.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(fondo, 0, 0);

    // Avatar
    const avatarURL = `https://dni-api-h5jr.onrender.com/avatar/${data.robloxId}`;

    console.log("Avatar:", avatarURL);

    const foto = await loadImage(avatarURL);

    const POS = {
        foto: {
            x: 30,
            y: 245,
            w: 400,
            h: 420
        },

        apellido: {
            x: 455,
            y: 170
        },

        nombre: {
            x: 455,
            y: 295
        },

        sexo: {
            x: 455,
            y: 470
        },

        nacionalidad: {
            x: 650,
            y: 470
        },

        nacimiento: {
            x: 1030,
            y: 470
        },

        documento: {
            x: 110,
            y: 620
        },

        emision: {
            x: 455,
            y: 620
        },

        vencimiento: {
            x: 820,
            y: 620
        }
    };

    // Foto

    ctx.drawImage(
        foto,
        POS.foto.x,
        POS.foto.y,
        POS.foto.w,
        POS.foto.h
    );

    // Texto

    ctx.fillStyle = "#111";
    ctx.textBaseline = "top";

    ctx.font = "bold 32px Arial";
    ctx.fillText(data.apellido || "", POS.apellido.x, POS.apellido.y);

    ctx.font = "bold 34px Arial";
    ctx.fillText(data.nombre || "", POS.nombre.x, POS.nombre.y);

    ctx.font = "bold 30px Arial";
    ctx.fillText(data.sexo || "", POS.sexo.x, POS.sexo.y);

    ctx.fillText(data.nacionalidad || "", POS.nacionalidad.x, POS.nacionalidad.y);

    ctx.fillText(data.nacimiento || "", POS.nacimiento.x, POS.nacimiento.y);

    ctx.font = "bold 36px Arial";
    ctx.fillText(data.documento || "", POS.documento.x, POS.documento.y);

    const hoy = new Date();

    const emision = hoy.toLocaleDateString("es-AR");

    const vencimiento = new Date(hoy);

    vencimiento.setFullYear(vencimiento.getFullYear() + 4);

    ctx.font = "bold 32px Arial";

    ctx.fillText(
        emision,
        POS.emision.x,
        POS.emision.y
    );

    ctx.fillText(
        vencimiento.toLocaleDateString("es-AR"),
        POS.vencimiento.x,
        POS.vencimiento.y
    );

    // Crear carpeta

    const carpeta = path.join(__dirname, "../public/dnis");

    if (!fs.existsSync(carpeta)) {
        fs.mkdirSync(carpeta, {
            recursive: true
        });
    }

    const archivo = `${data.documento}.png`;

    const salida = path.join(carpeta, archivo);

    console.log("Guardando en:");
    console.log(salida);

    fs.writeFileSync(
        salida,
        canvas.toBuffer("image/png")
    );

    console.log("¿Existe?");
    console.log(fs.existsSync(salida));

    console.log("Archivos:");
    console.log(fs.readdirSync(carpeta));

    console.log("========== DNI TERMINADO ==========");

    return `/dnis/${archivo}`;
}

module.exports = generateDNI;