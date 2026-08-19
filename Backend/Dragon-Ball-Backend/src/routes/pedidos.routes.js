const { Router } = require("express");
const { checkToken } = require("../middleware/auth.middleware");
const { create, getById, getByuser, getMisPedidos } = require("../controllers/pedidos.controller");


const router = Router()

router.get("/mis-pedidos", checkToken, getMisPedidos);
router.get('/:id', checkToken, getById)
router.get('/usuario', checkToken, getByuser)
router.post('/', checkToken, create)

module.exports = router
