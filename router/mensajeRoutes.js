/**
 * path api/messages
 */
const { Router } = require("express");
const { getChat } = require("../controllers/mensajeController");

const router = Router();

router.get("/:proyecto", getChat);

module.exports = router;
