// src/routes/direcciones.routes.js
const { Router } = require('express');
const { getByUser, create, remove } = require('../controllers/direcciones.controller');
const { checkToken } = require('../middleware/auth.middleware');

const router = Router();

router.get('/', checkToken, getByUser);
router.post('/', checkToken, create);
router.delete('/:id', checkToken, remove);

module.exports = router;