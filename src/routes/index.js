const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const dogs= require('./dogs')
const dogPost=require('./dogPost')
const temper=require('./temper')



const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use('/dogs',dogs)
router.use('/dogPost',dogPost)
router.use('/temper',temper)


module.exports = router;
