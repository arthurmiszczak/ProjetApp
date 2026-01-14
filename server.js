const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello Express');
});

app.listen(3000, () => {
    let monIp = require('ip').address();
    consol.log('Server running on http://$(monIp):3000');
});