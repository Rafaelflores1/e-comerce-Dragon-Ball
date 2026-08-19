const pool = require('../config/db')

const getAllCategories = async () => {
    const [rows] = await pool.execute('SELECT * FROM categorias')
    return rows
}

const getCategoryById = async (id) => {
    const [rows] = await pool.execute('SELECT * FROM categorias WHERE id=?', [id])
    return rows[0]
}

const createCategory = async ({nombre, descripcion}) => {
    const [result] = await pool.execute(
        'INSERT INTO categorias (nombre, descripcion) VALUES (?,?)',
        [nombre, descripcion || null]
    )
    return result
}

const updateCategory = async (id, {nombre, descripcion}) => {
    const [result] = await pool.execute(
        'UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?',
        [nombre, descripcion || null, id]
    )
    return result
}

const deleteCategory = async (id) => {
    const query = 'DELETE FROM categorias WHERE id = ?'
    const [result] = await pool.execute(query,[id])
    return result
}

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
}