const express = require('express');
const router = express.Router()
const axios = require('axios')
require('dotenv').config();
const { Dog, Temper } = require('../db');
const db = require('../db');
const {YOUR_API_KEY} = process.env;

const getApiInfo = async()=>{
    const apiUrl = await axios.get(`https://api.thedogapi.com/v1/breeds?api_key=${YOUR_API_KEY}`);
    const apiInfo = await apiUrl.data.map((result)=>{
        return {
            id:result.id,
            name: result.name,
            height_min:result.height.metric.split("-")[0],
            height_max:result.height.metric.split("-")[1] || result.height.metric.split("-")[0] ,
            weight_min:result.weight.metric.split("-")[0],
            weight_max:result.weight.metric.split("-")[1] || result.weight.metric.split("-")[0],
            life_span_min:result.life_span.split("-")[0],
            life_span_max:result.life_span.split("-")[1] || result.life_span.split("-")[0],
            image:result.image.url,
            temperament:result.temperament,
            createDb:false
    }})
    return apiInfo;
}

const getDbInfo= async()=>{
    return await Dog.findAll({
        include:{
            model: Temper,
            attributes : ['name'],
            through:{
                attributes:[],
            }
        }
    })
}

const getAllInfo= async()=>{
    const apiInfo = await getApiInfo();
    const dbInfo = await getDbInfo();
    const dbInfo2= await dbInfo.map((result)=>{
        return {
            id:result.id,
            name: result.name,
            height_min:result.height_min,
            height_max:result.height_max ,
            weight_min:result.weight_min,
            weight_max:result.weight_max,
            life_span_min:result.life_span_min,
            life_span_max:result.life_span_max,
            image:result.image,
            temperament:result.tempers.map((e)=>{
            return e.name}).join().replace(/,/g,', '),
            createDb:true
    }   
    })
    const infoAll = apiInfo.concat(dbInfo2);
    return infoAll 
}

router.get('/', async(req,res)=>{
    const name = req.query.name
    let DogsAll= await getAllInfo();
    if(name){
        let DogsName = await DogsAll.filter(el=>el.name.toLowerCase().includes(name.toLowerCase()))
        DogsName.length?
        res.status(200).send(DogsName):
        res.status(404).send('no se encontro raza con ese nombre')
    }else{
        res.status(200).send(DogsAll)
    }
})

router.get('/:id', async (req, res) =>{
    const id = req.params.id;

    const DogsAll = await getAllInfo();


    if(id.length > 0){
        let DogsId = await DogsAll.find(
            (el) => el.id == id
        );
        if(DogsId){
        res.status(200).json(DogsId)
        }else{
        res.status(404).send('No se encontro la raza')
        }
    } 
})



module.exports = router