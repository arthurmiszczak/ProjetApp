//
//récupération des éléments du DOM
const monInput = document.getElementById('monInput');
const monBouton = document.getElementById('monBouton');
const monBouton2 = document.getElementById('monBouton2');
const reponse = document.getElementById('reponse');
const pass = document.getElementById('pass');


//Ajout d'un écouteur d'événement sur le bouton
monBouton.addEventListener('click', () => {
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({input: monInput.value, password: pass.value})
    })
    .then(response => response.text())
    .then(data => {
        reponse.textContent = data;
    });
    
});


monBouton2.addEventListener('click', () => {

    fetch('/info').then(response => response.json()).then(data => reponse.textContent = data.cle1);
});

// Fonction pour charger et afficher les comptes de votes


const loginButton = document.getElementById('loginbutton');
loginButton.addEventListener('click', () => {
    const loginInput = document.getElementById('logininput').value;
    const passwordInput = document.getElementById('passwordinput').value;
    
     fetch('/connexion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ login: loginInput, password: passwordInput })
    }).then(response => response.json())
        .then(data => {
            alert(data.message);
            alert('ID utilisateur : ' + data.user.id);
            localStorage.setItem('userId', data.user.id);
           
        });
});

// Éléments pour le vote utilisateur
const voteValue = document.getElementById('voteValue');
const boutonVoteUser = document.getElementById('boutonVoteUser');
const resultatComptesVotes = document.getElementById('resultatComptesVotes');
const messageVote = document.getElementById('messageVote');

// Fonction pour charger et afficher les comptes de votes
function chargerComptesVotes() {
    fetch('/votes-count')
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                resultatComptesVotes.innerHTML = '<p>Aucun vote pour le moment</p>';
            } else {
                let html = '<h3>Comptes des votes:</h3>';
                data.forEach(item => {
                    html += `<p>${item.login}: ${item.vote_count} vote</p>`;
                });
                resultatComptesVotes.innerHTML = html;
            }
        })
        .catch(err => {
            console.error('Erreur:', err);
            resultatComptesVotes.textContent = 'Erreur lors du chargement des comptes de votes';
        });
}

// Écouteur pour le bouton Voter Utilisateur
boutonVoteUser.addEventListener('click', () => {
    const userId = localStorage.getItem('userId');
    const vote = voteValue.value.trim();
    
    if (!userId) {
        messageVote.innerHTML = '<p style="color: red;">Veuillez vous connecter d\'abord</p>';
        return;
    }
    
    if (!vote) {
        messageVote.innerHTML = '<p style="color: red;">Veuillez entrer le nom de la personne</p>';
        return;
    }
    
    fetch('/votes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: parseInt(userId), voteValue: vote })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.message); });
        }
        return response.json();
    })
    .then(data => {
        messageVote.innerHTML = '<p style="color: green;">Vous avez voté pour ' + vote + '</p>';
        voteValue.value = '';
        chargerComptesVotes(); 
    })
    .catch(err => {
        console.error('Erreur:', err);
        messageVote.innerHTML = '<p style="color: red;">' + err.message + '</p>';
    });
});

chargerComptesVotes();

setInterval(() => {
    chargerComptesVotes();
}, 1000);


fetch('/users',{
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
})
.then(response => response.json())
.then(data => {
    voteValue.innerHTML = '<option value="">--Sélectionnez un utilisateur--</option>';
    data.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.login;
        voteValue.appendChild(option);
    });
})