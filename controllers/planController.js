const { response } = require("express");
const Plan = require("../models/plan");

/**
 * 
 * @description: Busca los planes activos para los proyectos
 *
 */
const getPlanes = async (req, res = response) => {
  try {

    const planes = await Plan.find(
        { active: true  }
      )
    
    console.log(planes)

  res.json({
      ok: true,
      data: planes,
      
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'La peticion de buscar planes fallo'
    })
  }
}


module.exports = {
  getPlanes
}