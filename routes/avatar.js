const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/:userid", async (req, res) => {

    try {

        const userid = req.params.userid;

        const roblox = await axios.get(
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

        const image = roblox.data.data[0].imageUrl;

        res.redirect(image);

    } catch (err) {

        console.log(err);

        res.status(500).send("Error");

    }

});

module.exports = router;