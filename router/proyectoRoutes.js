/**
 * path api/projects
 */

const { Router } = require('express');
const { createProyecto, updateProyecto, getProyectosUsuario } = require('../controllers/proyectoController');
const router =  Router();

router.post('/create', createProyecto);
router.post('/update', updateProyecto);
router.get('/:user', getProyectosUsuario);









module.exports =  router;