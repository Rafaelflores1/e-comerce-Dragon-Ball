const pool = require ("../config/db")

const getAllUser = async () => {
    const query=`
    SELECT id, nombre, email, telefono, rol, created_at FROM usuarios  
    `
    const [rows] = await pool.execute(query)
    return rows;
}

const getUserByEmail = async (email) => {
    const query = `SELECT * FROM usuarios where email = ?`
    const [rows] = await pool.execute(query, [email])
    return rows[0]
}

const getUserById = async (id) =>{
    const query = `SELECT id, nombre, email, rol, created_at FROM usuarios WHERE id = ?`
    const [rows] = await pool.execute(query, [id])
    return rows[0]
}

const createUser = async (user = {}) => {
    const {
        nombre,email,password,telefono,rol
    } = user
    const query = 
    `
    INSERT INTO usuarios (nombre,email,password_hash,telefono,rol) VALUES (?,?,?,?,?)
    `
    const params = [
        nombre ?? null,
        email ?? null,
        password ?? null,
        telefono ?? 0,
        rol ?? "cliente"
    ]
    const [result] = await pool.execute ( query, params )
    return result
}

const updateUser = async (id,user = {}) => {
    const {
        nombre,
        email,
        password,
        telefono,
        rol

    } = user

    const query = 
    `
    UPDATE usuarios
    SET nombre=?, email=? , password_hash=?, telefono=?, rol=? WHERE id=?
    `

    const params = [
        nombre ?? null,
        email ?? null,
        password ?? null,
        telefono ?? 0,
        rol ?? "admin/cliente",
        id
    ]

    const [result] = await pool.execute(query,params)
    return result
}

const deleteUser = async (id) => {
    const query = `DELETE FROM usuarios WHERE id = ?`
    const [result] = await pool.execute(query, [id])
}

module.exports = {
    getAllUser,
    getUserByEmail,
    getUserById,
    createUser,
    updateUser,
    deleteUser
}