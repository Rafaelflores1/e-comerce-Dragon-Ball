const pool = require('../config/db')

const getAllSagas = async () => {
    const [rows] = await pool.query('SELECT * FROM sagas')
    return rows
}

const getSagaById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM sagas WHERE id = ?', [id])
    return rows[0]
}

const createSaga = async ({nombre,descripcion}) => {
    const query = 'INSERT INTO sagas (nombre,descripcion) VALUES (?,?)'
    const [result] = await pool.query(query, [nombre,descripcion||null],
        [nombre, descripcion || null]
        
    )
    return result
}

const updateSaga = async (id,{nombre,descripcion}) => {
    const query = 'UPDATE sagas SET nombre = ?, descripcion = ? WHERE id = ?'
    const [result] = await pool.execute(query,[nombre,descripcion||null, id]
    )
    return result
}

const deleteSaga = async (id) => {
    const [result] = await pool.query('DELETE FROM sagas WHERE id = ?', [id])
    return result
}

module.exports = {
    getAllSagas,
    getSagaById,
    createSaga,
    updateSaga,
    deleteSaga
}