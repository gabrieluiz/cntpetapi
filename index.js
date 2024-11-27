require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path'); // Módulo para manipulação de caminhos
const { Doacao, Voluntario, Pet } = require('./models');
const multer = require('multer'); // Para lidar com uploads de arquivo

const app = express();

// Configuração do CORS para permitir requisições somente do frontend correto
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://cntpetapi.onrender.com' // URL do frontend em produção
    : 'http://localhost:3000', // URL do frontend local para desenvolvimento
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
};

app.use(cors(corsOptions)); // Aplica a configuração de CORS
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

// Rota para atualizar a doação no backend
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
    doacao.img = img; // Atualize conforme necessário, especialmente se a imagem estiver sendo tratada no backend

    await doacao.save(); // Salva a doação no banco de dados

    res.json(doacao); // Retorna a doação atualizada
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

// Outras rotas para Voluntários, Pets etc.
app.get('/voluntarios', async (req, res) => {
  try {
    const voluntarios = await Voluntario.findAll();
    res.json(voluntarios);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar voluntários', error });
  }
});

// Rota para criação de Pet
app.post('/pets', async (req, res) => {
  const { nome, sexo, idade, especie, imagemUrl } = req.body;
  try {
    const novoPet = await Pet.create({
      nome,
      sexo,
      idade,
      especie,
      imagemUrl
    });
    res.json(novoPet);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar pet', error });
  }
});

// Rota para listar Pets
app.get('/pets', async (req, res) => {
  try {
    const pets = await Pet.findAll();
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar pets', error });
  }
});

// Rota para deletar Pet
app.delete('/pets/:id', async (req, res) => {
  try {
    await Pet.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Pet excluído com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir pet', error });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
