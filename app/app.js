const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Récupérer les informations de connexion à partir des variables d'environnement
const dbConfig = {
    host: 'mysql-service', // Nom du service Kubernetes MySQL
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

// Configurer la connexion à la base de données
const db = mysql.createConnection(dbConfig);

// Connecter à MySQL
db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données :', err);
        return;
    }
    console.log('Connecté à la base de données MySQL.');
    initializeDatabase();
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configuration pour EJS
app.set('view engine', 'ejs');

// Données simulées
let tasks = [];

// Routes
app.get('/', (req, res) => {
    const query = 'SELECT * FROM tasks';
    db.query(query, (err, results) => {
        if (err) throw err;
        res.render('index', { tasks: results });
    });
});

app.post('/add', (req, res) => {
    const { title, description } = req.body;
    const query = 'INSERT INTO tasks (title, task_description) VALUES (?, ?)';
    db.query(query, [title, description], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.post('/complete', (req, res) => {
    const taskId = req.body.taskId;
    const query = 'UPDATE tasks SET task_status = "complété" WHERE id = ?';
    db.query(query, [taskId], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});

// Fonction pour initialiser la base de données
function initializeDatabase() {
    const createDatabaseQuery = 'CREATE DATABASE IF NOT EXISTS tasksDB';
    const useDatabaseQuery = 'USE tasksDB';
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS tasks (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            task_description TEXT,
            task_status ENUM('en cours', 'complété') DEFAULT 'en cours',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    `;

    db.query(createDatabaseQuery, (err) => {
        if (err) throw err;
        db.query(useDatabaseQuery, (err) => {
            if (err) throw err;
            db.query(createTableQuery, (err) => {
                if (err) throw err;
                console.log('Base de données et table initialisées.');
            });
        });
    });
}
