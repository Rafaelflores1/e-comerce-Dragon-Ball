// src/routes/productos.routes.js
const { Router } = require('express');
const { getProducts, getProductById, create, update, deleteProduct, getAll } = require('../controllers/producto.controller');
const { checkToken } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');


const router = Router();

router.get('/',getAll)
router.get('/', getProducts);
router.get('/admin/all', checkToken, getProducts)
router.get('/:id', getProductById);
router.post('/',upload.single('imagen'),checkToken, create)
router.put('/:id',upload.single('imagen'),checkToken, update)
router.delete('/:id',checkToken, deleteProduct)

module.exports = router;