const jwt = require('jsonwebtoken')
const bcrypt = require ('bcryptjs')
const UsuariosModel = require ('../models/usuarios.model')

const getAllUsers = async (req,res ) => {
    try{
        const usuarios = await UsuariosModel.getAllUser()
        res.json(usuarios)
    }catch (error){
        console.log( 'error al traer a los usuarios')
        res.status(500).json({message : error.message})
    }
}

const getUserById = async (req,res) => {
    try{
        const {id} = req.params
        const usuarios = await UsuariosModel.getUserById(id)
        res.json(usuarios)
    }catch ( error){
        console.log('error al obtener el usuario')
        res.status(500).json({message: error.message})
    }
}

const getUserByEmail = async (req,res) => {
    try{
    const{email} = req.params
    const usuarios = await UsuariosModel.getUserByEmail(email)
    const {password, ...userData} = usuarios
    res.json(userData)
    }catch ( error){
        console.log('error al encontrar al usuario con el email')
        res.status(500).json({message:error.message})
    }
}

const register = async (req,res) => {
    try {
        const {nombre,email,password,telefono,rol} = req.body
        const userExist = await UsuariosModel.getUserByEmail(email)
        if(userExist){
            return res.status(400).json({message: 'El email ya esta registrado'})
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const result = await UsuariosModel.createUser({
            nombre,
            email,
            password: hashedPassword,
            telefono,
            rol: rol || 'cliente'
        })
        res.status(201).json({
            message: 'Usuario registrado con éxito',
            userId: result.insertId
        })
    }catch (error){
        console.log('error al registrar usuario:', error.message)
        res.status(500).json({message:error.message})
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const usuario = await UsuariosModel.getUserByEmail(email);
        if (!usuario) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }
        const isMatch = await bcrypt.compare(password, usuario.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }
        const payload = {
            id: usuario.id,
            email: usuario.email,
            rol: usuario.rol
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secreto_por_defecto'
        );

        // 👈 Limpiamos password_hash (no password)
        const { password_hash: _, ...userData } = usuario;

        res.json({
            message: 'Login correcto',
            token,
            usuario: userData // 👈 Cambiado 'user' por 'usuario' para que coincida con Angular
        });
    } catch (error) {
        console.log('Error al iniciar sesión:', error.message);
        res.status(500).json({ message: error.message });
    }
};

const update = async (req,res) => {
    try {
        const {id} = req.params
        const result = await UsuariosModel.updateUser(id,req.body)

        if (result.affectedRows === 0){
            return res.status(404).json({message: 'Usuario no encontrado'})
        }
        res.json({message: 'Usuario actualizado correctamente'})
    }catch (error){
        console.log('error al actualizar el usuario:', error.message)
        res.status(500).json({message: error.message})
    }
}

const deleteUser = async (req,res) => {
    try{
        const {id} = req.params
        const usuario = req.body
        const result = await UsuariosModel.deleteUser(id,usuario)
        res.status(201).json({message: 'Usuario eliminado'})
    }catch (error){
        console.log('error al eliminar el usuario')
        res.status(500).json({message: error.message})

    }
}

module.exports = {
    getAllUsers,
    getUserById,
    getUserByEmail,
    register,
    login,
    update,
    deleteUser
}