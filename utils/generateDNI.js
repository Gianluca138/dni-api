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
            x: 45,
            y: 245,
            w: 400,
            h: 420
        },

        // Centrado debajo de "Apellido/Surname"
        apellido: {
            x: 560, // Ajustado al centro del espacio de texto
            y: 305
        },

        // Centrado debajo de "Nombre/Name"
        nombre: {
            x: 560, // Alineado con el apellido
            y: 465  
        },

        // Centrado debajo de "Sexo"
        sexo: {
            x: 540, // Centrado bajo el título de sexo
            y: 665  
        },

        // Centrado debajo de "Nacionalidad"
        nacionalidad: {
            x: 675, // Ajustado para que "Argentina" no toque los otros textos
            y: 665  
        },

        // Centrado debajo de "Fecha de nacimiento"
        nacimiento: {
            x: 1200, // Centrado justo debajo del título de nacimiento
            y: 675  
        },

        // Número de documento (abajo de la foto, centrado)
        documento: {
            x: 110,  // Centrado justo debajo de "Documento/Document"
            y: 790  
        },

        // Centrado debajo de "Fecha de emisión"
        emision: {
            x: 560, // Centrado bajo el título de emisión
            y: 875 
        },

        // Centrado debajo de "Fecha de vencimiento"
        vencimiento: {
            x: 980, // Centrado bajo el título de vencimiento
            y: 875  
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

    ctx.font = "bold 38px Arial";
    ctx.fillText(data.apellido || "", POS.apellido.x, POS.apellido.y);

    ctx.font = "bold 38px Arial";
    ctx.fillText(data.nombre || "", POS.nombre.x, POS.nombre.y);

    ctx.font = "bold 38px Arial";
    ctx.fillText(data.sexo || "", POS.sexo.x, POS.sexo.y);

    ctx.fillText(data.nacionalidad || "", POS.nacionalidad.x, POS.nacionalidad.y);

    ctx.fillText(data.nacimiento || "", POS.nacimiento.x, POS.nacimiento.y);

    ctx.font = "bold 40px Arial";
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