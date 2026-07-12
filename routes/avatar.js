const express = require("express");

const router = express.Router();

router.get("/:userid", (req, res) => {
    res.json({
        ok: true,
        userid: req.params.userid
    });
});

module.exports = router;