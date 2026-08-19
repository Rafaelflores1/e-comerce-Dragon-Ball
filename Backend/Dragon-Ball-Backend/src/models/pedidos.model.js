const pool = require("../config/db");

const createOrder = async (
  usuario_id,
  { direccion_envio, metodo_pago, productos },
) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const total = productos.reduce(
      (acc, item) => acc + item.cantidad * item.precio_unitario,
      0,
    );
    const queryPedidos = `INSERT INTO pedidos (usuario_id, direccion_envio,total,estado,metodo_pago) VALUES (?,?,?,'Pendiente',?)`;
    const [resultPedido] = await connection.execute(queryPedidos, [
      usuario_id,
      direccion_envio,
      total,
      metodo_pago || "Tarjeta",
    ]);
    const pedido_id = resultPedido.insertId;
    const queryDetalle = `INSERT INTO detalles_pedido(pedido_id, producto_id,cantidad,precio_unitario) VALUES (?,?,?,?)`;
    const queryStock = `UPDATE productos SET stock = stock - ? WHERE id = ?`;
    for (let producto of productos) {
      await connection.execute(queryDetalle, [
        pedido_id,
        producto.producto_id,
        producto.cantidad,
        producto.precio_unitario,
      ]);
      await connection.execute(queryStock, [
        producto.cantidad,
        producto.producto_id,
      ]);
    }

    await connection.commit();
    return pedido_id;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const getOrdersByUser = async (usuario_id) => {
  const query = `
    SELECT id, direccion_envio,total,estado,metodo_pago, fecha_pedido
    FROM pedidos
    WHERE usuario_id = ?
    ORDER BY fecha_pedido DESC`;
};

const getOrderById = async (pedido_id, usuario_id) => {
  const queryPedido = `
        SELECT id, usuario_id, direccion_envio, total, estado, metodo_pago, fecha_pedido 
        FROM pedidos 
        WHERE id = ? AND usuario_id = ?
    `;
  const [pedidos] = await pool.execute(queryPedido, [pedido_id, usuario_id]);

  if (pedidos.length === 0) return null;

  const queryDetalles = `
        SELECT dp.id, dp.producto_id, p.nombre, p.imagen_url, dp.cantidad, dp.precio_unitario
        FROM detalles_pedido dp
        JOIN productos p ON dp.producto_id = p.id
        WHERE dp.pedido_id = ?
    `;
  const [detalles] = await pool.execute(queryDetalles, [pedido_id]);

  return {
    ...pedidos[0],
    productos: detalles,
  };
};
const selectPedidosByUsuario = async (usuarioId) => {
  const [pedidos] = await pool.query(
    'SELECT * FROM pedidos WHERE usuario_id = ? ORDER BY fecha_pedido DESC',
    [usuarioId]
  );

  for (let pedido of pedidos) {
    const [detalles] = await pool.query(
      `SELECT dp.*, p.nombre, p.imagen_url 
       FROM detalles_pedido dp
       LEFT JOIN productos p ON dp.producto_id = p.id
       WHERE dp.pedido_id = ?`,
      [pedido.id]
    );
    pedido.detalles = detalles;
  }

  return pedidos;
};

module.exports = {
  createOrder,
  getOrderById,
  getOrdersByUser,
  selectPedidosByUsuario,
};
