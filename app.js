// importation de l'application express
const express = require('express');
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://Chacha:Charlotte@cluster.kqxnlj7.mongodb.net/?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();
app.use((req, res, next) => {
    console.log('requete reçue')
    next();
});
app.use((req, res, next) => {
    res.status(201);
    next();
})
app.use((req, res, next) => {
    res.json({ message: "ok !" });
    next();
})
app.use((req, res) => {
    console.log('réponse ok')
})

module.exports = app; 