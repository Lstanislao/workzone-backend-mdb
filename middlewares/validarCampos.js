const { validationResult } = require("express-validator");

//next es para decir todo bien sigue con el siguiente 
const validarCampos = (req, res, next) => {
  
  const errores =  validationResult( req );

  if( !errores.isEmpty()){
    return res.status(400).json({
      ok: false,
      errors: errores.mapped()
    })
  }
  next(); 
}

module.exports = {
  validarCampos
}