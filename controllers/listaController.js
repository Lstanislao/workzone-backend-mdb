
const { response } = require("express");
const { Types} = require("mongoose");
const Lista = require("../models/lista");

/**
 * @description: crea una nueva lista del tablero de un proyecto , se crea por default activo
 * @param: nombre, id del proyecto
 */
 const createLista = async (req, res = response) => {
  try {
    console.log(req.body);
    
    const lista = new Lista(req.body);

    lista.save();

    res.json({
      ok: true,
      data: lista,
      
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'La peticion de crear lista fallo'
    })
  }
}

/**
 * 
 * @description: Busca las listas activas de un proyecto
 * @param: id del proyecto
 */
const getListasProyecto = async (req, res = response) => {
  try {

    const  id  = Types.ObjectId(req.params.proyecto);
    console.log('pro' + id)

    const listas = await Lista.aggregate()
    .match({ id_proyecto: id }, { active: true })
    .lookup({
          from: 'tareas',
          localField: '_id',
          foreignField: 'lista',
          as: 'tareas'
        }).exec()
    
    console.log(listas)

  res.json({
      ok: true,
      data: listas,
      
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'La peticion de buscar listas fallo'
    })
  }
}


module.exports = {
  createLista,
  getListasProyecto
}