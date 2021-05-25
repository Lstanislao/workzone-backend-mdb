const { response } = require("express");
const Tarea = require("../models/tarea");
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
      msg: 'La peticion de crear tarea fallo'
    })
  }
}

/**
 * @description: Actualiza una tarea. Sirve tanto para los campos que el usuario cambie como
 * para eliminar logicamente
 * @param: id tarea y el o los atributos a cambiar (nombre, descripcion, si esta activo, etc)
 */
const updateTarea = async (req, res = response) => {
  try {
   
    const { id_tarea } =  req.body;

    const tarea = new Tarea(req.body);

    Tarea.findByIdAndUpdate(id_tarea ,{...req.body},
      function (err, docs) {
        if (err){
            console.log(err)
        }
        else{
            console.log("Actualizada la tarea", docs);
        }
      })

  res.json({
      ok: true,
      data: tarea,
      
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'La peticion de actualizar tarea fallo'
    })
  }
}

/**
 * 
 * @description: Busca las tareas activas de un proyecto 
 * 
 * @param: id del proyecto
 */
const getTareasProyecto = async (req, res = response) => {
  try {

    const  id  = req.params.proyecto;

    const tareas = await Tarea.find(
        { id_proyecto: id, active: true  }
      ).sort( { createdAt: -1} )
    
    console.log(tareas)

  res.json({
      ok: true,
      data: tareas,
      
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'La peticion de buscar proyectos fallo'
    })
  }
}

/**
 * 
 * @description: Busca una tarea con el miembro asignado 
 * 
 * @param: id de la tarea
 */
const getTarea = async (req, res = response) => {
  try {
   
    const  id  = req.params.tarea;

    const tarea = await Tarea.findById(id)
      .populate('miembro')
      ;
    
  res.json({
      ok: true,
      data: tarea,
      
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'La peticion de buscar tarea fallo'
    })
  }
}


module.exports = {
  createTarea,
  updateTarea,
  getTareasProyecto,
  getTarea
}