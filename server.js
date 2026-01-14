const express = require('express');
const app = express();

app.get('/login', (req, res) => {
    res.send('Binvenue sur la page de login');
});






app.post('/register', (req, res) => {
    res.send('Merci de vous crée un compte');
});





app.use(express.static('public'));




app.listen(3000, () => {
    let monIp = require('ip').address();
    console.log(`Server running on http://${monIp}:3000`);
});