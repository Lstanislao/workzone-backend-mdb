/**
 * path api/lists
 */

const { Router } = require('express');
const { getListasProyecto } = require('../controllers/listaController');

const router =  Router();

router.get('/from/:proyecto', getListasProyecto);

module.exports =  router;