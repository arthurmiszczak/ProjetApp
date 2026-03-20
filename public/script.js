function charger() {

fetch("")

.then(response => response.json())

.then(data => {
    document.getElementById("resultat").innerHTML =
        "Menu : " + data.fichier + "<br>" +
        "Auteur : " + data.auteur + "<br>" +
        "Niveau : " + data.classe;
})

}