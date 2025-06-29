import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const auth = (req, res, next) => {
  const authHeader  = req.headers.authorization;

  if (!authHeader ) {
    console.log(`[AUTH] Token no proporcionado`);
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.email;
    next();
  } catch (error) {
    console.log(`[AUTH] Token inválido`);
    res.status(403).json({ error: 'Token inválido' });
  }
};

export default auth;
