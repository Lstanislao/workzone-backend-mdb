/**
 * path api/projects
 */

const { Router } = require('express');
const { createProyecto, updateProyecto, getProyectosUsuario, getProyecto } = require('../controllers/proyectoController');
const router =  Router();

router.post('/create', createProyecto);
router.post('/update', updateProyecto);
router.get('/by/:user', getProyectosUsuario);
router.get('/:proyecto', getProyecto);









module.exports =  router;