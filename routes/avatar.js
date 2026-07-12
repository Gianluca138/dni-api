const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/:userid", async (req, res) => {
    try {
        const userid = req.params.userid;

        const response = await axios.get(
            "https://thumbnails.roblox.com/v1/users/avatar-headshot",
            {
                params: {
                    userIds: userid,
                    size: "720x720",
                    format: "Png",
                    isCircular: false
                }
            }
        );

        console.log(response.data);

        if (
            !response.data.data ||
            response.data.data.length === 0 ||
            !response.data.data[0].imageUrl
        ) {
            return res.status(404).send("Avatar no encontrado");
        }

        res.redirect(response.data.data[0].imageUrl);

    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).send("Error al obtener el avatar");
    }
});

module.exports = router;