//
//récupération des éléments du DOM
const monInput = document.getElementById('monInput');
const monBouton = document.getElementById('monBouton');

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
        alert(data);
    });
    
});