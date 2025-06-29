import express from 'express';
import { registrarUsuario, loginUsuario, obtenerPerfil } from '../controllers/usuariosController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.post('/usuarios', registrarUsuario);
router.post('/login', loginUsuario);
router.get('/usuarios', auth, obtenerPerfil);

export default router;
