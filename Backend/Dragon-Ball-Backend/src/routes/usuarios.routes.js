const { Router } = require("express");
const { getAllUsers, getUserById, getUserByEmail, register, login, update, deleteUser } = require("../controllers/usuarios.controller");
const { checkToken } = require("../middleware/auth.middleware");



const router = Router()

router.get('/',checkToken, getAllUsers)
router.get('/:id',checkToken, getUserById)
router.get('/email/:email',checkToken, getUserByEmail)
router.post('/register',register)
router.post('/login',login)
router.put('/:id',checkToken,update)
router.delete('/:id',checkToken, deleteUser)

module.exports = router