import pool from '../db/config.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const registrarUsuario = async (req, res) => {
  try {
    const { email, password, rol, lenguage } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO usuarios (email, password, rol, lenguage) VALUES ($1, $2, $3, $4)',
      [email, hashedPassword, rol, lenguage]
    );
    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

export const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

    if (result.rowCount === 0){
        res.status(401).json({ message: 'Credenciales inválidas' });
        return;
    }

    const usuario = result.rows[0];
    const isValid = await bcrypt.compare(password, usuario.password);

    if (!isValid){
        res.status(401).json({ message: 'Credenciales inválidas' });
        return;
    }

    const token = jwt.sign( {email: usuario.email} , process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

export const obtenerPerfil = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT email, rol, lenguage FROM usuarios WHERE email = $1',
      [req.user]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el perfil' });
  }
};