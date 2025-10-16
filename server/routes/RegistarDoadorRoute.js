import express from 'express';
import {registarDoador } from '../controllers/RegistarDoadorController.js';

const router = express.Router();

router.post('/', registarDoador);

export default router;
