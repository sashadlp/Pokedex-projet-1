const dialogue = document.getElementById("dialogue");
const fermerButton = document.getElementById("fermer");

// Placer l'écouteur du bouton fermer UNE SEULE fois à l'extérieur
if (fermerButton) {
  fermerButton.addEventListener("click", () => {
    dialogue.close();
  });
}

let allPokemon = [];

class pokemon {
  id;
  nom;
  type;
  stats;
  sprites;

  constructor(id, nom, type, stats, sprites) {
    this.id = id;
    this.nom = nom;
    this.type = type;
    this.stats = stats;
    this.sprites = sprites;
  }
}

const getData = async () => {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=55").catch(error => {
    console.error("Error:", error);
  });

  if (response && response.status < 300) {
    const data = await response.json();
    const promises = data.results.map(async (p) => {
      const res = await fetch(p.url);
      return await res.json();
    });
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

    afficherPokemon(allPokemon);
  }
};

getData();

document.getElementById('searchBtn').addEventListener('click', () => {
  const searchValue = document.getElementById('search-input').value.trim();
  const resultats = allPokemon.filter(p => p.nom.includes(searchValue));
  const grid = document.getElementById('pokemon-grid');

  if (resultats.length === 0) {
    grid.innerHTML = `<p>Aucun Pokémon ne correspond à "${searchValue}".</p>`;
    return;
  }

  afficherPokemon(resultats);
});


function remplirModal(p) {
  
  const typesText = p.type.map(t => t.type.name).join(', ');


  const statsHTML = p.stats.map(s => `
    <div class="stat-row">
      <span class="stat-name">${s.stat.name} :</span>
      <span class="stat-valeur">${s.base_stat}</span>
    </div>
  `).join('');

  dialogue.innerHTML = `
    <div class="modal-content">
      <button id="fermer">❌Fermer</button>
      <h2>${p.nom} <strong>#${p.id}</strong></h2>
      <img src="${p.sprites}" alt="${p.nom}" class="modal-sprite">
      <p><strong>Type(s) :</strong> ${typesText}</p>
      
      <div class="stats-container">
        <h3>Statistiques de base</h3>
        ${statsHTML}
      </div>
    </div>
  `;


  document.getElementById("fermer").addEventListener("click", () => {
    dialogue.close();
  });
}

function afficherPokemon(liste) {
  const grid = document.getElementById('pokemon-grid');
  grid.innerHTML = "";

  liste.forEach(p => {
    const div = document.createElement("div");
    div.classList.add("pokemon-card");

    div.innerHTML = `
      <span class="badge-id">#${p.id}</span>
      <img src="${p.sprites}" alt="${p.nom}" class="pokemon-sprite">
      <h3>${p.nom}</h3>
      <button class="btn-favori" data-id="${p.id}">ajouter la carte aux Favoris</button>
    `;

    grid.appendChild(div);

    const imgSprite = div.querySelector('.pokemon-sprite');
    imgSprite.style.cursor = 'pointer';
    
    imgSprite.addEventListener('click', () => {
      remplirModal(p);
      dialogue.showModal();
    });
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