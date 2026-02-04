const express = require('express');
const app = express();
const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: '172.29.18.116',
    user: 'Demo',
    password: 'Demo',
    database: 'BddArthur',
});

console.log('Connexion réussie à la base de données');

connection.on('error', (err) => {
    console.error('Erreur connexion MySQL:', err);
});

app.use(express.json());
app.use(express.static('public'));

app.get('/login', (req, res) => {
    res.send('Binvenue sur la page de login');
});

app.post('/register', (req, res) => {
    console.log('Données reçues pour l\'inscription');
    console.log(req.body);

    connection.query(
      'INSERT INTO Users (login, password) VALUES (?, ?)',
      [req.body.input, req.body.password],
      (err, results) => {
        if (err) {
          console.error('Erreur lors de l\'insertion dans la base de données :', err);
          res.status(500).json({ message: 'Erreur serveur' });
          return;
        }
        console.log('Insertion réussie, ID utilisateur :', results.insertId);
        res.json({ message: 'Inscription réussie !', userId: results.insertId });
      }
    );
});

app.get('/info', (req, res) => {
    res.json({cle1: 'valeur1', cle2: 'valeur2'});
});


    



app.post('/connexion', (req, res) => {  
  const { login, password } = req.body;
  connection.query('SELECT * FROM Users WHERE login = ? AND password = ?', [login, password], (err, results) => {
      if (err) {
        console.error('Erreur lors de la vérification des identifiants :', err);
        res.status(500).json({ message: 'Erreur serveur' });
        return;
      }
      if (results.length === 0) {
        res.status(401).json({ message: 'Identifiants invalides' });
        return;
      }
      // Identifiants valides 
      res.json({ message: 'Connexion réussie !', user: results[0] });
    });
});



app.listen(3000, () => {
    let monIp = require('ip').address();
    console.log(`Server running on http://${monIp}:3000`);
});


app.post('/votes', (req, res) => {
  // D'abord, trouver l'id de l'utilisateur voté
  connection.query('SELECT id FROM Users WHERE login = ?', [req.body.voteValue], (err, results) => {
    if (err) {
        console.error('Erreur lors de la recherche de l\'utilisateur voté :', err);
        res.status(500).json({ message: 'Erreur serveur' });
        return;
    }
    if (results.length === 0) {
        // Créer un nouvel utilisateur
        connection.query('INSERT INTO Users (login, password) VALUES (?, ?)', [req.body.voteValue, ''], (err, insertResult) => {
            if (err) {
                console.error('Erreur lors de la création de l\'utilisateur :', err);
                res.status(500).json({ message: 'Erreur serveur' });
                return;
            }
            const idVoted = insertResult.insertId;
            insertVote(req.body.userId, idVoted, res);
        });
    } else {
        const idVoted = results[0].id;
        insertVote(req.body.userId, idVoted, res);
    }
});

function insertVote(iduser, idvote, res) {
    connection.query(
        'INSERT INTO Votes (iduser, idvote) VALUES (?, ?)',
        [iduser, idvote],
        (err, results) => {
            if (err) {
                console.error('Erreur lors de l\'insertion dans la base de données :', err);
                res.status(500).json({ message: 'Erreur serveur' });
                return;
            }
            res.json({ message: 'Vote enregistré !', voteId: results.insertId });
        }
    );
}
});


app.get('/votes-count', (req, res) => {
connection.query(
'SELECT Users.login, COUNT(*) as vote_count FROM Votes JOIN Users ON Votes.idvote = Users.id GROUP BY Users.login ORDER BY vote_count DESC',
(err, results) => {
if (err) {
console.error('Erreur lors du comptage des votes :', err);
res.status(500).json({ message: 'Erreur serveur' });
return;
}
res.json(results);
}
);
});


app.get('/votes-list', (req, res) => {
connection.query(
'SELECT Voter.login as voter, Voted.login as voted_for FROM Votes JOIN Users as Voter ON Votes.iduser = Voter.id JOIN Users as Voted ON Votes.idvote = Voted.id ORDER BY Votes.id',
(err, results) => {
if (err) {
console.error('Erreur lors de la récupération des votes :', err);
res.status(500).json({ message: 'Erreur serveur' });
return;
}
res.json(results);
}
);
});




