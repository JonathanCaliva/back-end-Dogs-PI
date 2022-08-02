const express = require('express')
const router = express.Router()
require('dotenv').config();
const { Dog, Temper} = require('../db');

router.post('/', async(req,res)=>{
    
    let{
        name,
        height_min,
        height_max,
        weight_min,
        weight_max,
        life_span_min,
        life_span_max,
        image,
        createDb,
        temperament  
    }= req.body;
    try {
        let dogCreate = await Dog.create({ 
            name,
            height_min,
            height_max,
            weight_min,
            weight_max,
            life_span_min,
            life_span_max,
            image,
            createDb          
        })
        let temperDb = await Temper.findAll({where: { name : temperament }})
        dogCreate.addTemper(temperDb)
        res.status(200).send('Perro creado con exito')
    } catch (error) {
        console.log(error)
    }
});



module.exports= router
