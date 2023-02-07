// importation de l'application express
const express = require('express');
const app = express();
const mongoose = require('mongoose');
// Import du pluging dotenv et helmet
const dotenv = require('dotenv').config();
const helmet = require('helmet')


// Importation des routes sauce et user 
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

const path = require('path');

// Connexion au serveur MONGO DB 
mongoose.connect(process.env.SECRET_DB,  //protection des données sensible 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());



app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});



app.use(helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
}))
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

app.use('/images', express.static(path.join(__dirname, 'images')))

module.exports = app; 