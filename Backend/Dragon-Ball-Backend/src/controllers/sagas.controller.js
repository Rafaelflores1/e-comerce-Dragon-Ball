const sagasModel = require('../models/sagas.model')

const getAll = async (req,res) => {
    try {
        const sagas = await sagasModel.getAllSagas()
        res.json(sagas)
    }catch (error){
        res.status(500).json({message: 'Error al obtener las sagas', error})
    }
}

const getById = async (req,res) =>{
    try{
        const {id} = req.params
        const saga = await sagasModel.getSagaById(id)
        res.json(saga)
    }catch (error){
        res.status(500).json({message: 'error al obetener la saga', error})
    }
}

const create = async  (req,res) => {
    try{
        const {nombre,descripcion} = req.body
        if(!nombre){
            res.status(400).json({message: 'El nombre es obligatorio'})
        }
        const result = await sagasModel.createSaga({nombre,descripcion})
        res.status(201).json({message: 'Saga creada correctamente', id: result.insertId})
        
    }catch ( error){
        res.status(500).json({message: error.message})
    }
}

const update = async (req,res) => {
    try{
        const {id} = req.params
        const {nombre,descripcion} = req.body
        const result = await sagasModel.updateSaga(id,{nombre,descripcion})
        if(result.affectedRows === 0){
            return res.status(404).json({message: 'Saga no encontrada'})
        }

        res.json({message: 'saga actualizada correctamente'})
    }catch (error){
        res.status(500).json({message: error.message})
    }
}

const remove = async (req,res) => {
    try{
        const {id} = req.params
        const result = await sagasModel.deleteSaga(id)
        if (result.affectedRows === 0){
            return res.status(404).json({ message: 'Saga no encontrada'})
        }
        res.json({message:'Saga eliminada correctamente'})
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