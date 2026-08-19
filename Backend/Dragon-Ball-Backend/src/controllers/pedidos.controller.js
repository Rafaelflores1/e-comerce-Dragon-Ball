const PedidosModel = require("../models/pedidos.model");
const { selectPedidosByUsuario } = require('../models/pedidos.model');

const create = async (req, res) => {
  try {
    const usuario_id = req.user.id || req.user.usuario_id;
    const { direccion_envio, metodo_pago, productos } = req.body;

    if (!productos || productos.length === 0) {
      return res.status(400).json({ message: "El pedido no tiene productos" });
    }
    if (!direccion_envio) {
      return res
        .status(400)
        .json({ message: "La dirección de envío es obligatoria" });
    }
    const pedido_id = await PedidosModel.createOrder(usuario_id, {
      direccion_envio,
      metodo_pago,
      productos,
    });

    res.status(201).json({
      message: "pedido procesado correctamente",
      pedido_id,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error procesando el pedido", error: error.message });
  }
};

const getByuser = async (req, res) => {
  try {
    const usuario_id = req.user.id || req.user.usuario_id;
    const pedidos = await PedidosModel.getOrdersByUser(usuario_id);
    res.json(pedidos);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al encontrar el historial de productos",
        error: error.message,
      });
  }
};

const getById = async (req, res) => {
  try {
    const usuario_id = req.user.id || req.user.usuario_id;
    const { id } = req.params;

    const pedido = await PedidosModel.getOrderById(id, usuario_id);

    if (!pedido) {
      return res
        .status(404)
        .json({ message: "Pedido no encontrado o no pertenece al usuario" });
    }

    res.json(pedido);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "Error al obtener el detalle del pedido",
        error: error.message,
      });
  }

  const { selectPedidosByUsuario } = require("../models/pedidos.model");
};
const getMisPedidos = async (req, res) => {
  try {
    const usuarioId = req.user?.id || req.user?.usuario_id;

    if (!usuarioId) {
      return res.status(401).json({ mensaje: 'Usuario no autenticado' });
    }

    const pedidos = await selectPedidosByUsuario(usuarioId);
    return res.status(200).json(pedidos);
  } catch (error) {
    console.error('Error SQL al obtener pedidos:', error);
    return res.status(500).json({ 
      mensaje: 'Error al obtener los pedidos', 
      errorDetail: error.message 
    });
  }
};
module.exports = {
  create,
  getByuser,
  getById,
  getMisPedidos,
};
