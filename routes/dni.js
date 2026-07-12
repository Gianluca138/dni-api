const express = require("express");
const router = express.Router();

const generateDNI = require("../utils/generateDNI");

router.post("/create", async (req, res) => {

    try {

        const body = req.body;

const image = await generateDNI({
    nombre: body.nombre,
    apellido: body.apellido,
    sexo: body.sexo,
    nacionalidad: body.nacionalidad,
    nacimiento: body.nacimiento,
    documento: body.documento,
    robloxId: body.robloxId
});

        res.json({
            success: true,
            image: `https://dni-api-h5jr.onrender.com${image}`
        });

    } catch(err){

        console.error(err);

        res.status(500).json({
            success:false,
            error:err.message
        });

    }

});

module.exports = router;