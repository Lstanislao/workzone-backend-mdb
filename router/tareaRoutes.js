/**
 * path api/tasks
 */

const { Router } = require('express');
const { updateTarea, getTarea, createTarea, getTareasProyecto } = require('../controllers/tareaController');

const router =  Router();

router.post('/create', createTarea);
router.post('/update', updateTarea);
router.get('/from/:proyecto', getTareasProyecto);
router.get('/:tarea', getTarea);









module.exports =  router;