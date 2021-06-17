const Usuario = require("../models/usuario");
const Proyecto = require("../models/proyecto");

/*
 * @descripcion actualiza el online de la base de datos cuando un usuario se conecta
 * @param  uid
 * @returns todo el usuario de la db
 */
const conectarUsuario = async (uid) => {
  const usuario = await Usuario.findById(uid);

  usuario.onLine = true;

  await usuario.save();

  return usuario;
};

/*
 * @descripcion actualiza el online de la base de datos cuando un usuario se desconecta
 * @param  uid
 * @returns todo el usuario de la db
 */
const desconectarUsuario = async (uid) => {
  const usuario = await Usuario.findById(uid);

  usuario.onLine = false;

  await usuario.save();

  return usuario;
};

/**
 * Obtiene todos los proyectos donde esta esa persona con sus miembros
 * @param {} uid
 * @returns
 */
const getUsuariosChat = async (uid) => {
  const proyectosUsuarios = await Proyecto.find({
    miembros: { $in: [uid] },
    active: true,
  }).populate("miembros");

  //console.log(proyectosUsuarios);

  return proyectosUsuarios;
};

/**
 *
 * @param {*} uid
 * @returns àrray con los id de los proyectos donde esta esa persona
 */
const getProyectosIds = async (uid) => {
  const proyectos = await Proyecto.find({
    miembros: { $in: [uid] },
    active: true,
  }).distinct("_id");

  //console.log(proyectos);

  return proyectos;
};

module.exports = {
  conectarUsuario,
  desconectarUsuario,
  getUsuariosChat,
  getProyectosIds,
};
