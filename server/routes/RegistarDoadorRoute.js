const express = require('express');
const router = express.Router();

const {registarDoador }= require('../controllers/RegistarDoadorController')



router.post('/',registarDoador );



module.exports = router;