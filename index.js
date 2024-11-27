// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { Doacao, Voluntario, Pet } = require('./models');
const multer = require('multer');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuração para upload de arquivos (armazenar na pasta 'uploads')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Configuração para servir arquivos estáticos da pasta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas para Doações
app.get('/doacoes', async (req, res) => {
    try {
        const doacoes = await Doacao.findAll();
        res.json(doacoes);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar doações', error });
    }
});

app.post('/doacoes', upload.single('img'), async (req, res) => {
    try {
        const { nome, descricao, preco } = req.body;
        const imgPath = req.file ? '/uploads/' + req.file.filename : null;

        const novaDoacao = await Doacao.create({
            nome,
            descricao,
            preco,
            img: imgPath
        });
        res.json(novaDoacao);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar doação', error });
    }
});

app.put('/doacoes/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, preco, img } = req.body;

  try {
      const doacao = await Doacao.findByPk(id);
      if (!doacao) {
          return res.status(404).json({ message: 'Doação não encontrada' });
      }

      // Atualiza os campos da doação
      doacao.nome = nome;
      doacao.descricao = descricao;
      doacao.preco = preco;
      doacao.img = img; 

      await doacao.save();

      res.json(doacao);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao atualizar doação' });
  }
});

app.delete('/doacoes/:id', async (req, res) => {
    try {
        await Doacao.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Doação removida com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir doação', error });
    }
});

// **Rotas para Voluntários**

// Listar todos os voluntários
app.get('/voluntarios', async (req, res) => {
    try {
        const voluntarios = await Voluntario.findAll();
        res.json(voluntarios);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar voluntários', error });
    }
});

// Criar um novo voluntário
app.post('/voluntarios', async (req, res) => {
    try {
        const { nome, email, telefone } = req.body;
        const novoVoluntario = await Voluntario.create({
            nome,
            email,
            telefone
        });
        res.json(novoVoluntario);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar voluntário', error });
    }
});

// Atualizar um voluntário
app.put('/voluntarios/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, email, telefone } = req.body;

  try {
      const voluntario = await Voluntario.findByPk(id);
      if (!voluntario) {
          return res.status(404).json({ message: 'Voluntário não encontrado' });
      }

      // Atualiza os campos do voluntário
      voluntario.nome = nome;
      voluntario.email = email;
      voluntario.telefone = telefone;

      await voluntario.save();

      res.json(voluntario);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao atualizar voluntário' });
  }
});

// Deletar um voluntário
app.delete('/voluntarios/:id', async (req, res) => {
    try {
        await Voluntario.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Voluntário removido com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir voluntário', error });
    }
});

// **Rotas para Pets**

// Listar todos os pets
app.get('/pets', async (req, res) => {
    try {
        const pets = await Pet.findAll();
        res.json(pets);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar pets', error });
    }
});

// Criar um novo pet
app.post('/pets', upload.single('img'), async (req, res) => {
    try {
        const { nome, sexo, idade, especie } = req.body;
        const imgPath = req.file ? '/uploads/' + req.file.filename : null;

        const novoPet = await Pet.create({
            nome,
            sexo,
            idade,
            especie,
            img: imgPath
        });
        res.json(novoPet);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar pet', error });
    }
});

// Atualizar um pet
app.put('/pets/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, sexo, idade, especie, img } = req.body;

  try {
      const pet = await Pet.findByPk(id);
      if (!pet) {
          return res.status(404).json({ message: 'Pet não encontrado' });
      }

      pet.nome = nome;
      pet.sexo = sexo;
      pet.idade = idade;
      pet.especie = especie;
      pet.img = img;

      await pet.save();

      res.json(pet);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao atualizar pet' });
  }
});

// Deletar um pet
app.delete('/pets/:id', async (req, res) => {
    try {
        await Pet.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Pet removido com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir pet', error });
    }
});

// Iniciar o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
