const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./database.db');

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rotas
app.post('/pessoas', (req, res) => {
    const { nome, descriptor, imagem_base64, tipo } = req.body;

    // Converter o descriptor para uma string JSON
    const descriptorString = JSON.stringify(descriptor);

    const query = `INSERT INTO pessoas (nome, descriptor, imagem_base64, tipo) VALUES (?, ?, ?, ?)`;
    db.run(query, [nome, descriptorString, imagem_base64, tipo], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID });
    });
});

app.get('/pessoas', (req, res) => {
    const query = `SELECT * FROM pessoas`;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.post('/comparar', (req, res) => {
    const { descriptor } = req.body;

    // Buscar todas as pessoas no banco de dados
    db.all('SELECT * FROM pessoas', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        let melhorMatch = null;
        let menorDistancia = Infinity;

        // Comparar o descritor recebido com os descritores no banco de dados
        rows.forEach((row) => {
            const descriptorBanco = JSON.parse(row.descriptor);
            const distancia = faceapi.euclideanDistance(descriptor, descriptorBanco);

            if (distancia < menorDistancia) {
                menorDistancia = distancia;
                melhorMatch = row;
            }
        });

        // Definir um limite para considerar uma correspondência
        const limiteDistancia = 0.6; // Ajuste conforme necessário
        if (menorDistancia < limiteDistancia) {
            res.json({ match: true, pessoa: melhorMatch });
        } else {
            res.json({ match: false });
        }
    });
});
// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});