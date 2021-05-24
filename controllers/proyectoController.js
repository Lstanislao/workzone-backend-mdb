const { response } = require("express");
const Proyecto = require("../models/proyecto");
const Usuario = require("../models/usuario");
const Plan = require("../models/plan");
const { getUsuarioByEmail } = require('../controllers/authController'); 

/**
 * @description: crea un nuevo proyecto , se crea por default activo y no archivado
 * @param nombre, descripcion, miembros
 */
const createProyecto = async (req, res = response) => {
  try {
    console.log(req.body);
    /**
     * Testantemto de  luis a ori con amor AVISAME CUANDO LEAS ESTO PARA HABLAR SOBRE LOS ROLES
     * 
     * yo digo que en miembros vengan array de los correos y aqui se haga la peticion en base a esos correos
     * de los id de esa gente para guardarlo en el array de mienbros que va a ir a la base de datos
     * 
     * mano  ni idea como validar si esos correos en nuestra bd
     *  existen desde el front ahi se hara un peticion para validar
     * 
     * bueno luego de meditarlo creo que a penas entremos a la pantalla de crear proyecto
     * se puede hacer la peticion de todos los correos de la bd y asi se verifica si los correos que el ingreso
     * estan en lal bd idk porque de hecho esta peticion tarda burda
     * 
     * ademas si se piden todos los correos es decir todos los usuarios ya podriamos mandar los id no se que te parece 
     */

    // const correos =  req.body.miembros
    // const miembrosIds = await Promise.all 
    //   (correos.map( async (email) => {
      
    //   const user = await getUsuarioByEmail(email);
      
    //   return user.id
    // }))

    // req.body.miembros =  miembrosIds;
    
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
      .populate('plan')
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

const getProyectosUsuario = async (req, res = response) => {
  try {
    console.log(req.params.user)
    console.log(req.body)
    const  uid  = req.params.user;

    const proyectos = await Proyecto.find(
        { miembros: { $in: [uid]}, active: true  }
      ).sort( { createdAt: -1} )
    
    // await Proyecto.aggregate()
    // .match({ miembros: { $in: [uid] }, active: true })
    // .addFields({ numMiembros: { $size: "$miembros" } })
    // .sort({ createdAt: -1});
    
    // await Proyecto.aggregate([
    //   { $match: { miembros: { $in: [uid] } } },
    //   { $sort: { createdAt: -1 }},
    //   { $addFields: { numMiembros: { $size: "$miembros" } }}
    // ])

    

    
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