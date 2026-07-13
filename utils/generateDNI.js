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

        // Debajo de "Apellido/Surname"
        apellido: {
            x: 265, // Movido a la izquierda para alinearse con el inicio de la línea
            y: 265  // Bajado para quedar debajo de "Apellido/Surname"
        },

        // Debajo de "Nombre/Name"
        nombre: {
            x: 265, // Movido a la izquierda
            y: 395  // Bajado para quedar debajo de "Nombre/Name"
        },

        // Debajo de "Sexo"
        sexo: {
            x: 265, // Movido a la izquierda
            y: 540  // Bajado para quedar debajo de "Sexo"
        },

        // Debajo de "Nacionalidad"
        nacionalidad: {
            x: 390, // Ajustado para centrarse bajo "Nacionalidad/Nationality"
            y: 540  // Bajado
        },

        // Debajo de "Fecha de nacimiento"
        nacimiento: {
            x: 670, // Ajustado para centrarse bajo "Fecha de nacimiento/Date of birth"
            y: 540  // Bajado
        },

        // Número de documento (abajo de la foto)
        documento: {
            x: 75,
            y: 720  // Bajado para que no tape la foto del avatar
        },

        // Debajo de "Fecha de emisión"
        emision: {
            x: 295, // Ajustado para centrarse bajo "Fecha de emisión"
            y: 775  // Bajado
        },

        // Debajo de "Fecha de vencimiento"
        vencimiento: {
            x: 525, // Ajustado para centrarse bajo "Fecha de vencimiento"
            y: 775  // Bajado
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

    ctx.font = "bold 36px Arial";
    ctx.fillText(data.apellido || "", POS.apellido.x, POS.apellido.y);

    ctx.font = "bold 36px Arial";
    ctx.fillText(data.nombre || "", POS.nombre.x, POS.nombre.y);

    ctx.font = "bold 36px Arial";
    ctx.fillText(data.sexo || "", POS.sexo.x, POS.sexo.y);

    ctx.fillText(data.nacionalidad || "", POS.nacionalidad.x, POS.nacionalidad.y);

    ctx.fillText(data.nacimiento || "", POS.nacimiento.x, POS.nacimiento.y);

    ctx.font = "bold 38px Arial";
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