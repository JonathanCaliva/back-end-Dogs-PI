const express = require('express');
const router = express.Router()
const axios = require('axios')
const { Temper } = require('../db');
require('dotenv').config();
const {YOUR_API_KEY} = process.env;



router.get('/', async (req, res) => {
    const temperaments = await axios.get(`https://api.thedogapi.com/v1/breeds?api_key=${YOUR_API_KEY}`);
    const temperament = temperaments.data.map((el) => el.temperament);
  
    let procesado = temperament
    .map((el) => {
      if (el == null) return "";
      return el.split(", ");
    })
    .flat();

  let result = procesado.sort();

  let temperamentSinRepetir = [];

  result.forEach((el) => {
    if (temperamentSinRepetir.indexOf(el) === -1) {
      temperamentSinRepetir.push(el);
    }
  });   



    temperamentSinRepetir.forEach((el) => {
        Temper.findOrCreate({
            where: { name: el },
        });
    });
    const allTemper = await Temper.findAll();
    res.send(allTemper);
    })


module.exports = router;