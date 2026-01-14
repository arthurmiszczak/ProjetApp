const express = require('express');
const app = express();

app.get('/login', (req, res) => {
    res.send('Binvenue sur la page de login');
});






app.post('/register', (req, res) => {
    console.log('Données reçues pour l\'inscription');
    console.log(req.body);
    res.json({message: 'inscription réussie!'});
});





app.use(express.static('public'));
app.use(express.json());


app.get('/info',(req, res) => {
    res.json({cle1: 'valeur1', cle2: 'valeur2'});
});

app.listen(3000, () => {
    let monIp = require('ip').address();
    console.log(`Server running on http://${monIp}:3000`);
});