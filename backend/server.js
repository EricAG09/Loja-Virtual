const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer"); // Adicionado para lidar com uploads
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

// Configuração de conexão com MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000
        });
        console.log("Conectado ao MongoDB!");
    } catch (error) {
        console.error("Erro ao conectar ao MongoDB", error);
        process.exit(1);
    }
};

connectDB();

exports.connectDB = connectDB;

const ItemSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    categoria: String,
    image: String,
});
const Produto = mongoose.model("Produto", ItemSchema);

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage });

// Rota POST para adicionar um novo produto
app.post("/produtos", upload.single("image"), async (req, res) => {
    try {
        const newProduct = new Produto({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: `http://localhost:5000/uploads/${req.file.filename}`,
        });
        await newProduct.save();
        res.status(201).send(newProduct);
    } catch (err) {
        console.error("Erro ao salvar o produto:", err);
        res.status(500).send(err);
    }
});

// Rota GET para listar todos os produtos
app.get("/produtos", async (req, res) => {
    try {
        const items = await Produto.find();
        res.json(items);
    } catch (err) {
        console.error("Erro ao buscar os produtos:", err);
        res.status(500).send(err);
    }
});

app.get("/categorias", async (req, res) => {
    try {
        const items = await Produto.find();
        const categorias = items.map(item => item.category);
        const uniqueCategorias = [...new Set(categorias)];
        res.json(uniqueCategorias);
    } catch (error) {
        console.error("Erro ao buscar as categorias:", error);
    }
})

// Rota para editar produto
app.put("/produtos/:id", upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category } = req.body;

        // Verifica se todos os campos obrigatórios estão presentes
        if (!name || !description || !price || category) {
            return res.status(400).json({ message: "Todos os campos devem ser preenchidos." });
        }

        // Verifica se o produto existe
        const existingProduct = await Produto.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ message: "Produto não encontrado." });
        }

        // Se uma nova imagem foi carregada, use o caminho da nova imagem
        const updatedProduct = {
            name: name || existingProduct.name,
            description: description || existingProduct.description,
            price: price || existingProduct.price,
            category: category || existingProduct.category,
            image: req.file ? req.file.path : existingProduct.image, 
        };

        // Atualiza o produto no banco de dados
        const updatedItem = await Produto.findByIdAndUpdate(
            id, updatedProduct, { new: true } // Retorna o documento atualizado
        );

        if (!updatedItem) {
            return res.status(404).json({ message: "Produto não encontrado." });
        }

        res.json(updatedItem);
    } catch (err) {
        console.error("Erro ao atualizar produto:", err);
        res.status(500).json({ message: "Erro ao atualizar produto no backend", error: err });
    }
});

// Rota para deletar um produto
app.delete('/produtos/:id', async (req, res) => {
    try {
      const { id } = req.params;
      console.log("ID recebido para exclusão:", id);  // Verifique o ID recebido
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }
  
      const produto = await Produto.findByIdAndDelete(id);
      if (!produto) {
        return res.status(404).json({ message: "Produto não encontrado" });
      }
      res.status(200).json({ message: "Produto deletado com sucesso!" });
    } catch (error) {
      console.error("Erro ao deletar produto:", error);  // Log do erro
      res.status(500).json({ message: "Erro ao deletar produto" });
    }
  });
  

// Servindo arquivos estáticos (imagens)
app.use("/uploads", express.static("uploads"));

// Inicializando o servidor
app.listen(PORT, () => {
    console.log("Servidor rodando na porta 5000 e conectado ao MongoDB");
});