const { response } = require("express");
const Proyecto = require("../models/proyecto");
const Usuario = require("../models/usuario");
const Plan = require("../models/plan");
const { getUsuarioByEmail } = require('../controllers/authController'); 

/**
 * @description: crea un nuevo proyecto , se crea por default activo y no archivado
 * @param: nombre, descripcion, miembros
 */
const createProyecto = async (req, res = response) => {
  try {
    console.log(req.body);
    
    const proyecto = new Proyecto(req.body);

    proyecto.save();

    res.json({
      ok: true,
      data: proyecto,
      
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'La peticion de crear proyecto fallo'
    })
  }
}

/**
 * @description: Actualiza un proyecto. Sirve tanto para los campos que el usuario cambie como
 * para archivar y eliminar logicamente
 * @param: id proyecto y el o los atributos a cambiar (nombre, descripcion, id plan elegido, si esta archivado, si esta activo, etc)
 */
const updateProyecto = async (req, res = response) => {
  try {
   
    const { id_proyecto } =  req.body;

    const proyecto = new Proyecto(req.body);

    Proyecto.findByIdAndUpdate(id_proyecto ,{...req.body},
      function (err, docs) {
        if (err){
            console.log(err)
        }
        else{
            console.log("Actualizado el proyecto", docs);
        }
      })

  res.json({
      ok: true,
      data: proyecto,
      
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'La peticion de actualizar proyecto fallo'
    })
  }
}

/**
 * 
 * @description: Busca un proyecto con su respectivo plan y miembros 
 * 
 * @param: id del proyecto
 */
const getProyecto = async (req, res = response) => {
  try {
    console.log(req.params.proyecto)
    console.log(req.body)
    const  uid  = req.params.proyecto;

    const proyecto = await Proyecto.findById(uid)
      .populate('id_plan')
      .populate('miembros');
    
    console.log(proyecto)

  res.json({
      ok: true,
      data: proyecto,
      
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'La peticion de buscar proyecto fallo'
    })
  }
}

/**
 * 
 * @description: Busca un los proyectos activos de un usuario 
 * 
 * @param: id del usuario
 */
const getProyectosUsuario = async (req, res = response) => {
  try {
    console.log(req.params.user)
    console.log(req.body)
    const  uid  = req.params.user;

    const proyectos = await Proyecto.find(
        { miembros: { $in: [uid]}, active: true  }
      ).sort( { createdAt: -1} )
    
    console.log(proyectos)

  res.json({
      ok: true,
      data: proyectos,
      
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'La peticion de buscar proyectos fallo'
    })
  }
}


module.exports = {
  createProyecto,
  updateProyecto,
  getProyectosUsuario,
  getProyecto
}