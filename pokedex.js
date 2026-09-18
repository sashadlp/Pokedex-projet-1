
 let allPokemon=[]
 let pokemonfavoris = JSON.parse(localStorage.getItem('favoris')) || [];
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
    
    afficherPokemon(allPokemon);
  }
  else{
    // Status code >= 300
  }
}
 
getData()


function majfavcount() {
  let nbfav = document.getElementById('fav-count')
  if (nbfav) {
    nbfav.textContent=pokemonfavoris.length
  }
  
}
majfavcount();



document.getElementById('searchBtn').addEventListener('click', () => {

  const searchValue = document.getElementById('search-input').value.trim();

 
  const resultats = allPokemon.filter(p => p.nom().includes(searchValue));

  const grid = document.getElementById('pokemon-grid');


  if (resultats.length === 0) {
    grid.innerHTML = `<p>Aucun Pokémon ne correspond à "${searchValue}".</p>`;
    return;
  }

  
  afficherPokemon(resultats);
});
function afficherPokemon(liste) {
  const grid = document.getElementById('pokemon-grid');

  grid.innerHTML = "";
  liste.forEach(p => {
    const estFavori = pokemonfavoris.includes(p.id);
  const texteBouton = estFavori ? " ❤️" : " 🤍";
    const div = document.createElement("div");
     div.classList.add("pokemon-card");

     div.innerHTML = `
        <span class="badge-id">#${p.id}</span>
        <img src="${p.sprites}" alt="${p.nom}">
        <h3>${p.nom}</h3>
        <button class="btn-favori" data-id="${p.id}">${texteBouton}</button>
            `;
            grid.appendChild(div);
  });
}


const searchInput = document.getElementById('search-input');
const typeFilter = document.getElementById('type-filter');


function filtrerPokemon() {
    const searchValue = searchInput.value.trim();
    const selectedType = typeFilter.value;

    const resultats = allPokemon.filter(p => {
        
        const correspondNom = p.nom.includes(searchValue);
        
      
        const correspondType = selectedType === 'all' || p.type.some(t => t.type.name === selectedType);

        return correspondNom && correspondType;
    });

    const grid = document.getElementById('pokemon-grid');

    if (resultats.length === 0) {
        grid.innerHTML = `<p class="no-result">Désolé mais nous n'avons trouvé aucun pokémon.</p>`;
        return;
    }

    afficherPokemon(resultats);
}

searchInput.addEventListener('input', filtrerPokemon);

typeFilter.addEventListener('change', filtrerPokemon);

document.getElementById('pokemon-grid').addEventListener('click', (event) => {
    if (event.target.classList.contains('btn-favori')) {
        
        const id = parseInt(event.target.dataset.id);
        
        console.log("ID du Pokémon cliqué :", id);
        if (pokemonfavoris.includes(id)) {
            pokemonfavoris = pokemonfavoris.filter(favId => favId !== id);
            event.target.textContent = "🤍";
        } else {
            pokemonfavoris.push(id);
            event.target.textContent = "❤️";
        }   
        majfavcount();
        localStorage.setItem('favoris', JSON.stringify(pokemonfavoris));
        
    }
});