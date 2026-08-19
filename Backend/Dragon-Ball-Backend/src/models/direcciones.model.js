// src/models/direcciones.model.js
const pool = require('../config/db');

const createAddress = async (usuario_id, datos) => {
    const { direccion, ciudad, codigo_postal, pais } = datos;

    const [result] = await pool.execute(
        'INSERT INTO direcciones (usuario_id, direccion, ciudad, codigo_postal, pais) VALUES (?, ?, ?, ?, ?)',
        [
            usuario_id ?? null,
            direccion ?? null,
            ciudad ?? null,
            codigo_postal ?? null,
            pais ?? null
        ]
    );
    return result.insertId;
};

const getByUserId = async (usuario_id) => {
    const [rows] = await pool.execute(
        'SELECT * FROM direcciones WHERE usuario_id = ?', 
        [usuario_id]
    );
    return rows;
};

const deleteAddress = async (id, usuario_id) => {
    const [result] = await pool.execute(
        'DELETE FROM direcciones WHERE id = ? AND usuario_id = ?',
        [id, usuario_id]
    );
    return result.affectedRows > 0;
};

module.exports = { getByUserId, createAddress, deleteAddress };