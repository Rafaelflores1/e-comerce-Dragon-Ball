const CategoriasModel = require('../models/categorias.model')

const getAll = async (req,res) => {
    try{
    const categoria = await CategoriasModel.getAllCategories()
    res.json(categoria)
    }catch (error){
        res.status(500).json({message:message.error})
    }
}
const getById = async (req,res) => {
    try{
        const {id} = req.params
        const categoria = await CategoriasModel.getCategoryById(id)
        if (!categoria){
            return res.status(404).json({message: 'categoria no encontrada'})
        }
        res.json(categoria)
    }catch (error){
        res.status(500).json({message:message.error})
    }
}
const create = async (req,res) => {
    try{
        const {nombre, descripcion} = req.body
        if(!nombre){
            return res.status(404).json({message: 'no se ha creado la categoria'})
        }
        const result = await CategoriasModel.createCategory({nombre, descripcion})
        res.status(201).json({
            message: 'Categoria creada con éxito',
            id: result.insertId
        })
    }catch (error){
        res.status(500).json({message:error.message})
    }
}
const update = async (req,res) => {
    try{
        const {id} = req.params
        const {nombre, descripcion} = req.body
        const result = await CategoriasModel.updateCategory(id, {nombre, descripcion})
        if (result.affectedRows ===0){
            return res.status(404).json({message: '  '})
        }
        return res.json({message: 'Categoria actualizada'})
    }catch (error){
        res.status(500).json({message:message.error})
    }
}

const remove = async (req, res) => {
    try{
        const {id} = req.params
        const result = await CategoriasModel.deleteCategory(id)
        if(result.affectedRows === 0){
            return res.status(404).json({message: 'no se encuentra la categoria'})
        }
        res.json({message: 'Categoria eliminada'})
    }catch (error){
        res.status(500).json({message: error.message})

    }
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
}