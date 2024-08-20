const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Rota de registro
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    console.log('Dados recebidos:', { name, email, password });
  
    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Por favor, preencha todos os campos' });
    }
  
    try {
      // Verifica se o usuário já existe
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'Usuário já existe' });
      }
  
      // Cria um novo usuário
      user = new User({
        name,
        email,
        password,
      });
  
      // Criptografa a senha antes de salvar
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
  
      await user.save();
  
      res.status(201).json({ msg: 'Usuário registrado com sucesso' });
    } catch (err) {
      console.error('Erro durante o registro:', err.message);
      res.status(500).send('Erro no servidor');
    }
});

// Rota de login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verifica se o usuário existe
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }

    // Verifica se a senha está correta
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }

    // Gera um token JWT
    const payload = {
      user: {
        id: user.id,
        name: user.name,  // Inclui o nome do usuário no payload
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }, // Token válido por 1 hora
      (err, token) => {
        if (err) throw err;
        res.json({ token, name: user.name });  // Inclui o nome na resposta
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;
