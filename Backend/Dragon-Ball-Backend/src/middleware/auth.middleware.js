const jwt = require('jsonwebtoken')

const checkToken = (req,res, next) => {
    const authHeader = req.headers['authorization']

    if(!authHeader) {
        return res.status(401).json({message: 'Acceso denegado. Se requiere Token'})
    }
    const token = authHeader.includes('Bearer') ? authHeader.split(' ')[1] : authHeader

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto_por_defecto')
        req.user = decoded
        next()
    }catch (error){
        return res.status(403).json({message: 'Token inválido'})
    }
}

module.exports = {
    checkToken
}