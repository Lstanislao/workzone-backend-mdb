const { response } = require("express");
const Tarea = require("../models/tarea");
const { Types } = require("mongoose");
const Lista = require("../models/lista");
const Usuario = require("../models/usuario");

/**
 * @description: crea una nueva tarea, se crea por default activa
 * @param: nombre, descripcion
 */
const createTarea = async (req, res = response) => {
  try {
    console.log(req.body);

    const tarea = new Tarea(req.body);

    tarea.save();

    res.json({
      ok: true,
      data: tarea,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "La peticion de crear tarea fallo",
    });
  }
};

/**
 * @description: Actualiza una tarea. Sirve tanto para los campos que el usuario cambie como
 * para eliminar logicamente
 * @param: id tarea y el o los atributos a cambiar (nombre, descripcion, si esta activo, etc)
 */
const updateTarea = async (req, res = response) => {
  try {
    const { id_tarea } = req.body;

    const tarea = new Tarea(req.body);

    Tarea.findByIdAndUpdate(
      id_tarea,
      { ...req.body },
      { new: true },
      function (err, docs) {
        if (err) {
          console.log(err);
          res.status(500).json({
            ok: false,
            msg: "La peticion de actualizar tarea fallo",
          });
        } else {
          console.log("Actualizada la tarea", docs);
          res.json({
            ok: true,
            data: docs,
          });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "La peticion de actualizar tarea fallo",
    });
  }
};

/**
 * @description: Actualiza todas las tareas cuyo miembro sea alguno de los del array que se recibe y las deja sin miembro asignado
 ** 
 * @param: id proyecto y array de ids de miembros
 */
 const desasignarTarea = async (req, res = response) => {
  try {
    const { id_proyecto, miembros } = req.body;

    Tarea.updateMany(
      { id_proyecto, miembro: { $in: miembros } }, 
      { miembro: null },
      function (err, docs) {
        if (err) {
          console.log(err);
          res.status(500).json({
            ok: false,
            msg: "La peticion de actualizar tarea fallo",
          });
        } else {
          console.log("Actualizada la tarea", docs);
          res.json({
            ok: true,
            data: docs,
          });
        }
      }
    );

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "La peticion de desasignar miembros de tarea fallo",
    });
  }
};

/**
 *
 * @description: Busca las tareas activas de un proyecto
 *
 * @param: id del proyecto
 */
const getTareasProyecto = async (req, res = response) => {
  try {
    const id = req.params.proyecto;

    const tareas = await Tarea.find({ id_proyecto: id, active: true }).sort({
      createdAt: -1,
    });

    console.log(tareas);

    res.json({
      ok: true,
      data: tareas,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "La peticion de buscar tareas fallo",
    });
  }
};

/**
 *
 * @description: Busca las tareas activas de un proyecto y las agrupa por miembro, buscando el numero total,
 * los tiempos de cada una y el nombre del miembro
 *
 * @param: id del proyecto
 */
const getTareasPorMiembro = async (req, res = response) => {
  try {
    const id = Types.ObjectId(req.params.proyecto);

    const tareas = await Tarea.aggregate()
      .match({ id_proyecto: id }, { active: true })
      .group({
        _id: "$miembro",
        tareas: { $sum: 1 },
        tiempo: { $push: "$cronometro" },
      })
      .lookup({
        from: "usuarios",
        localField: "_id",
        foreignField: "_id",
        as: "miembro",
      })
      .project({
        _id: 1,
        tareas: 1,
        tiempo: 1,
        miembro: {
          nombre: 1,
          apellido: 1,
        },
      });

    console.log(tareas);

    res.json({
      ok: true,
      data: tareas,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "La peticion de buscar tareas fallo",
    });
  }

};

/**
 *
 * @description: Busca las tareas activas de un usuario dentro de un proyecto
 *
 * @param: id del proyecto, id del usuario
 */
const getTareasUsuarioProyecto = async (req, res = response) => {
  try {
    console.log(req.params);
    const id = req.params.proyecto;
    const id_miembro = req.params.usuario;

    const tareas = await Tarea.find({
      id_proyecto: id,
      active: true,
      miembro: id_miembro,
    });

    console.log(tareas);

    res.json({
      ok: true,
      data: tareas,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "La peticion de buscar tareas de un usuario dentro de un poryecto fallo",
    });
  }
};

/**
 *
 * @params id_tarea, id_lista
 * @description elimina una tarea tanto d euna lista como la tarea como tal
 */
const deleteTarea = async (req, res = response) => {
  try {
    console.log(req.body);
    const id_tarea = req.body.id_tarea;
    const id_lista = req.body.id_lista;
    console.log(id_tarea);

    await Tarea.findByIdAndRemove(id_tarea);
    //eliminar tarea de la lista
    // let lista = await Lista.findById(id_lista);

    // console.log(lista);

    // lista.items.pull(id_tarea);
    // lista.save();
    // console.log(lista);

    res.json({
      ok: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "estas pelandooo",
    });
  }
};

/**
 *
 * @description: Busca una tarea con el miembro asignado
 *
 * @param: id de la tarea
 */
const getTarea = async (req, res = response) => {
  try {
    const id = req.params.tarea;

    const tarea = await Tarea.findById(id).populate("miembro");
    res.json({
      ok: true,
      data: tarea,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "La peticion de buscar tarea fallo",
    });
  }
};

module.exports = {
  createTarea,
  updateTarea,
  desasignarTarea,
  getTareasProyecto,
  getTareasPorMiembro,
  getTarea,
  deleteTarea,
  getTareasUsuarioProyecto,
};
