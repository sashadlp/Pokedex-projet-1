fetch("https://pokeapi.co/api/v2/pokemon?limit=55")
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error("Error:", error));

  const getData = async () => {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=55")
    .catch(error => {
      console.error("Error:", error)
    });
 
  if(response.status < 300){
    const data = await response.json();
    console.log(data)
  }
  else{
    // Status code >= 300
  }
}
 
getData()


export class pokemon {
   // variables de class
    id
    nom
    type
    stats
    sprites
 
  // constructeur qui set les variables de class
  constructor(id, nom, type, stats, sprites) {
    this.id = id ;
    this.nom = nom;
    this.type = type;
    this.stats = stats;
    this.sprites = sprites

  }
}

document.getElementById('searchBtn').addEventListener('click', () => {})
      


function renderPokemon(list) {
  const grid = document.getElementById('pokemon-grid');
  

  grid.innerHTML = '';

}
