
 let allPokemon=[]

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


 class pokemon {
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
const unPokemon = new pokemon(
  details.id,
  details.name,
  details.types,
  details.stats,
  details.sprites.front_default
);


document.getElementById('searchBtn').addEventListener('click', () => {
  // 1. On récupère le texte tapé par l'utilisateur
  const searchValue = document.getElementById('search-input').value.trim().toLowerCase();

  // 2. On filtre notre tableau de Pokémon
  const resultats = allPokemon.filter(p => p.nom.toLowerCase().includes(searchValue));

  const grid = document.getElementById('pokemon-grid');

  // 3. Gestion du cas vide (si aucun résultat)
  if (resultats.length === 0) {
    grid.innerHTML = `<p>Aucun Pokémon ne correspond à "${searchValue}".</p>`;
    return;
  }

  // 4. Si on a des résultats, on relance l'affichage avec la liste filtrée
  afficherPokemon(resultats);
});