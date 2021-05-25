/**
 * path api/lists
 */

const { Router } = require('express');
const { getListasProyecto, createLista } = require('../controllers/listaController');

const router =  Router();

router.post('/create', createLista);
router.get('/from/:proyecto', getListasProyecto);

module.exports =  router;