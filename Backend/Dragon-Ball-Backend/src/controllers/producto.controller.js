
const ProductoModel = require("../models/producto.model");



const getAll = async (req,res) => {
  try{
    const {limit, offset, categoria_id,saga_id,nombre} = req.query
    const resultado = await ProductoModel.getAllWithFilters({
      limit: limit || 10,
      offset: offset || 0,
      categoria_id,
      saga_id,
      nombre
    })
    res.json(resultado)
  }catch (error){
    res.status(500).json({message: 'Error al obtener el producto', error:error.message})
  }
}





const getProducts = async (req, res) => {
  try {
    const { limit, offset, categoria_id, saga_id, nombre } = req.query;
    const resultado = await ProductoModel.getAllWithFilters({
      limit: limit || 10,
      offset: offset || 0,
      categoria_id,
      saga_id,
      nombre
    });
    res.json(resultado);
  } catch (error) {
    console.log("Error al obtener el producto", error);
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductoModel.getProductById(id);
    if (!product) {
      res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json(product);
  } catch (error) {
    console.log("Error al obtener el producto", error);
    res.status(500).json({ message: error.message });
  }
};

const create = async (req, res) => {
    try {
        const { nombre, descripcion, precio, stock, altura_cm, material, categoria_id, saga_id, destacado } = req.body;

        if (!nombre || precio === undefined) {
            return res.status(400).json({ message: 'El nombre y el precio son obligatorios' });
        }

        const imagen_url = req.file ? `/uploads/${req.file.filename}` : (req.body.imagen_url || null);

        const result = await ProductoModel.createProduct({
            nombre,
            descripcion,
            precio,
            stock,
            imagen_url, // 👈 Nombre exacto de tu BD
            altura_cm,
            material,
            categoria_id,
            saga_id,
            destacado
        });

        res.status(201).json({
            message: 'Producto creado correctamente',
            id: result.insertId,
            imagen_url
        });
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).json({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const productData = req.body;

        if (req.file) {
            productData.imagen = `/uploads/${req.file.filename}`;
        }

        const result = await ProductoModel.updateProduct(id, productData);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json({ message: 'Producto actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = req.body;
    const result = await ProductoModel.deleteProduct(id, product);
    res.status(201).json({ message: "Producto eliminado" });
  } catch (error) {
    console.log("error al actualizar el producto");
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAll,
  getProducts,
  getProductById,
  create,
  update,
  deleteProduct,
};
