// src/controllers/direcciones.controller.js
const DireccionesModel = require('../models/direcciones.model');

const create = async (req, res) => {
    try {
        // Aseguramos capturar el ID del usuario del token
        const usuario_id = req.user.id || req.user.usuario_id;
        const { direccion } = req.body;

        if (!direccion) {
            return res.status(400).json({ message: 'La dirección es obligatoria' });
        }

        if (!usuario_id) {
            return res.status(401).json({ message: 'Usuario no identificado en el token' });
        }

        const id = await DireccionesModel.createAddress(usuario_id, req.body);
        res.status(201).json({ message: 'Dirección guardada correctamente', id });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al guardar la dirección', error: error.message });
    }
};

const getByUser = async (req, res) => {
    try {
        const usuario_id = req.user.id || req.user.usuario_id;
        const direcciones = await DireccionesModel.getByUserId(usuario_id);
        res.json(direcciones);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las direcciones', error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const usuario_id = req.user.id || req.user.usuario_id;
        const { id } = req.params;
        const deleted = await DireccionesModel.deleteAddress(id, usuario_id);

        if (!deleted) {
            return res.status(404).json({ message: 'Dirección no encontrada o no pertenece al usuario' });
        }

        res.json({ message: 'Dirección eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar la dirección', error: error.message });
    }
};

module.exports = { getByUser, create, remove };