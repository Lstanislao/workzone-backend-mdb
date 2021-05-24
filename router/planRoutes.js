/**
 * path api/plans
 */

const { Router } = require('express');
const { getPlanes } = require('../controllers/planController');

const router =  Router();

router.get('/', getPlanes);

module.exports =  router;