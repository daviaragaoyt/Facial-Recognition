const sqlite3 = require('sqlite3').verbose();

// Conectar ao banco de dados (ou criar se não existir)
const db = new sqlite3.Database('./database.db');

// Criar tabela de pessoas
db.serialize(() => {
    db.run(`
      CREATE TABLE pessoas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descriptor TEXT NOT NULL,  -- Descritor facial (array de números)
    imagem_base64 TEXT NOT NULL,  -- Imagem em base64
    tipo TEXT NOT NULL CHECK(tipo IN ('procurada', 'desaparecida'))
);
    `);

    console.log('Tabela "pessoas" criada com sucesso.');
});

db.close();