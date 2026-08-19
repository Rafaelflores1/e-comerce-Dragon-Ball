const {Router} = require('express')
const {checkToken} = require('../middleware/auth.middleware')
const { getAll, getById, create, update, remove } = require('../controllers/categorias.controller')


const router = Router()

router.get('/', getAll)
router.get('/:id',getById)
router.post('/',checkToken, create)
router.put('/:id',checkToken, update)
router.delete('/:id',checkToken, remove)

module.exports = router