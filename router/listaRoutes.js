/**
 * path api/lists
 */

const { Router } = require('express');
const { getListasProyecto, createLista, updateLista } = require('../controllers/listaController');

const router =  Router();

router.post('/create', createLista);
router.post('/update', updateLista);
router.get('/from/:proyecto', getListasProyecto);

module.exports =  router;