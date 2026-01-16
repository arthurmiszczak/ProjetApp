//
//récupération des éléments du DOM
const monInput = document.getElementById('monInput');
const monBouton = document.getElementById('monBouton');
const monBouton2 = document.getElementById('monBouton2');
const reponse = document.getElementById('reponse');

//Ajout d'un écouteur d'événement sur le bouton
monBouton.addEventListener('click', () => {
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({input: monInput.value})
    })
    .then(response => response.text())
    .then(data => {
        reponse.textContent = data;
    });
    
});

monBouton2.addEventListener('click', () => {

    fetch('/info').then(response => response.json()).then(data => reponse.textContent = data.cle1);
});