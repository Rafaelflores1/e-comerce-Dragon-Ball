const pool = require("../config/db");

const getAllProducts = async (limit = 10, offset = 0) => {
  const query = `
    SELECT p.*, c.nombre AS categoria, s.nombre AS saga 
    FROM productos p
    JOIN categorias c ON p.categoria_id = c.id
    JOIN sagas s ON p.saga_id = s.id
    LIMIT ? OFFSET ?
  `;
  // Ojo: en pool.execute si usas LIMIT/OFFSET a veces da error de tipos en MySQL si no se pasan como enteros
  const [rows] = await pool.execute(query, [Number(limit), Number(offset)]);
  return rows;
};

const getProductById = async (id) => {
  const query = `
    SELECT p.*, c.nombre AS categoria, s.nombre AS saga
    FROM productos p
    JOIN categorias c ON p.categoria_id = c.id
    JOIN sagas s ON p.saga_id = s.id
    WHERE p.id = ?
    `;
  const [rows] = await pool.query(query, [id]);
  return rows[0];
};

const getAllWithFilters = async ({ limit = 10, offset = 0, categoria_id, saga_id, nombre }) => {
    let query = 'SELECT * FROM productos WHERE 1=1';
    const params = [];

    if (categoria_id) {
        query += ' AND categoria_id = ?';
        params.push(Number(categoria_id));
    }

    if (saga_id) {
        query += ' AND saga_id = ?';
        params.push(Number(saga_id));
    }

    if (nombre) {
        query += ' AND nombre LIKE ?';
        params.push(`%${nombre}%`);
    }

    const limitNum = Number(limit) || 10;
    const offsetNum = Number(offset) || 0;

    query += ' LIMIT ? OFFSET ?';
    params.push(limitNum, offsetNum);

    const [rows] = await pool.query(query, params);

    // Conteo para paginación
    let countQuery = 'SELECT COUNT(*) as total FROM productos WHERE 1=1';
    const countParams = [];

    if (categoria_id) {
        countQuery += ' AND categoria_id = ?';
        countParams.push(Number(categoria_id));
    }
    if (saga_id) {
        countQuery += ' AND saga_id = ?';
        countParams.push(Number(saga_id));
    }
    if (nombre) {
        countQuery += ' AND nombre LIKE ?';
        countParams.push(`%${nombre}%`);
    }

    const [[{ total }]] = await pool.query(countQuery, countParams);

    return {
        productos: rows,
        total,
        limit: limitNum,
        offset: offsetNum
    };
};

const createProduct = async (product = {}) => {
  
  const {
    nombre,
    descripcion,
    precio,
    stock,
    imagen_url,
    altura_cm,
    material,
    categoria_id,
    saga_id,
    destacado,
  } = product;

  
  const query = `
        INSERT INTO productos 
        (nombre, descripcion, precio, stock, imagen_url, altura_cm, material, categoria_id, saga_id, destacado) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

  
  const params = [
    nombre ?? null,
    descripcion ?? null,
    precio ?? 0,
    stock ?? 0,
    imagen_url ?? null,
    altura_cm ?? null,
    material ?? "PVC/ABS",
    categoria_id ?? null,
    saga_id ?? null,
    destacado ? 1 : 0,
  ];

  const [result] = await pool.execute(query, params);
  return result;
};

const updateProduct = async (id, product = {}) => {
    const { 
        nombre, 
        descripcion, 
        precio, 
        stock, 
        imagen_url, 
        altura_cm, 
        material, 
        categoria_id, 
        saga_id, 
        destacado 
    } = product;

    const query = `
        UPDATE productos 
        SET nombre = ?, descripcion = ?, precio = ?, stock = ?, imagen_url = ?, 
            altura_cm = ?, material = ?, categoria_id = ?, saga_id = ?, destacado = ? 
        WHERE id = ?
    `;

    const params = [
        nombre ?? null,
        descripcion ?? null,
        precio ?? 0,
        stock ?? 0,
        imagen_url ?? null,
        altura_cm ?? null,
        material ?? 'PVC/ABS',
        categoria_id ?? null,
        saga_id ?? null,
        destacado ? 1 : 0,
        id 
    ];

    const [result] = await pool.execute(query, params);
    return result;
};

const deleteProduct = async (id) => {
  const query = `
    DELETE FROM productos WHERE id = ?`;
  const [result] = await pool.execute(query, [id]);
};



module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllWithFilters
};
