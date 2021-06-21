const Mensaje = require("../models/mensaje");
const { Types } = require("mongoose");

/**
 *
 * @param id del rpoyecto del cual se desea obtener el chat
 * @description obtiene los ultimos 30 mensajes del chat */
const getChat = async (req, res) => {
  let proyecto_id = req.params.proyecto;
  proyecto_id = proyecto_id.toString();
  console.log(proyecto_id);

  //proyecto_id = Types.ObjectId(proyecto_id);

  const last30 = await Mensaje.find({ para: proyecto_id })
    .sort({ createdAt: "asc" })
    .limit(30)
    .populate("de");

  res.json({
    ok: true,
    mensajes: last30,
  });
};

module.exports = {
  getChat,
};
