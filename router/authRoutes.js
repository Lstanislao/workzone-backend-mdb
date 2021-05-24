/**
 * path api/auth
 */

const { Router } = require('express');
const { check } = require('express-validator');
const { createUsuario, login, renewToken, updateUsuario } = require('../controllers/authController');
const { validarCampos } = require('../middlewares/validarCampos');
const { validarJWT } = require('../middlewares/validarJwt');
const router =  Router();

//create user
router.post('/create', createUsuario);

//login el check es por si se quiere validar pero creo que lo haremos desde el front
router.post('/login',[
  check('email', 'El email es  obligatorio').isEmail(),
  validarCampos
],login);

//Renovar token
router.get('/renew', validarJWT ,renewToken);

//update usuario
router.post('/update', updateUsuario);








module.exports =  router;