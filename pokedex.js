
 let allPokemon=[]
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

 const getData = async () => {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=55")
    .catch(error => {
      console.error("Error:", error)
    });
 
  if(response.status < 300){
    const data = await response.json();
    const promises = data.results.map(async (p) => {
      const res = await fetch(p.url);
    return await res.json();})
    const tousLesDetails = await Promise.all(promises);
    allPokemon = tousLesDetails.map((details) => {
  return new pokemon(
    details.id,
    details.name,
    details.types,
    details.stats,
    details.sprites.front_default
  );
});

console.log(allPokemon);
    
    console.log(allPokemon)
  }
  else{
    // Status code >= 300
  }
}
 
getData()






document.getElementById('searchBtn').addEventListener('click', () => {

  const searchValue = document.getElementById('search-input').value.trim().toLowerCase();

 
  const resultats = allPokemon.filter(p => p.nom.toLowerCase().includes(searchValue));

  const grid = document.getElementById('pokemon-grid');


  if (resultats.length === 0) {
    grid.innerHTML = `<p>Aucun Pokémon ne correspond à "${searchValue}".</p>`;
    return;
  }

  
  afficherPokemon(resultats);
});