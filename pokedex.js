const dialogue = document.getElementById("dialogue");
const fermerButton = document.getElementById("fermer");

if (fermerButton) {
  fermerButton.addEventListener("click", () => {
    dialogue.close();
  });
}

// Les variables globales doivent être déclarées ICI, HORS de la classe :
let allPokemon = [];
let pokemonfavoris = JSON.parse(localStorage.getItem("favoris")) || [];

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
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=112").catch((error) => {
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

function majfavcount() {
  const nbfav = document.getElementById("fav-count");
  if (nbfav) {
    nbfav.textContent = `Vous avez ${pokemonfavoris.length} pokemon favoris`;
  }
}

function remplirModal(p) {
  const typesText = p.type.map((t) => t.type.name).join(", ");

  const statsHTML = p.stats
    .map(
      (s) => `
    <div class="stat-row">
      <span class="stat-name">${s.stat.name} :</span>
      <span class="stat-valeur">${s.base_stat}</span>
    </div>
  `
    )
    .join("");

dialogue.innerHTML = `
    <div class="modal-content">
      <button id="fermer">❌ Fermer</button>
      <h2 class="modal-title">${p.nom} <strong>#${p.id}</strong></h2>
      <div class="sprite-container">
        <img src="${p.sprites}" alt="${p.nom}" class="modal-sprite">
      </div>
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
  const grid = document.getElementById("pokemon-grid");
  if (!grid) return;

  grid.innerHTML = "";

  liste.forEach((p) => {
    const estFavori = pokemonfavoris.includes(p.id);
    const texteBouton = estFavori ? "❤️" : "🤍";

    const div = document.createElement("div");
    div.classList.add("pokemon-card");

    div.innerHTML = `
      <span class="badge-id">#${p.id}</span>
      <img src="${p.sprites}" alt="${p.nom}" class="pokemon-sprite">
      <h3>${p.nom}</h3>
      <button class="btn-favori" data-id="${p.id}">${texteBouton}</button>
    `;

    grid.appendChild(div);

    const imgSprite = div.querySelector(".pokemon-sprite");
    imgSprite.style.cursor = "pointer";
    imgSprite.addEventListener("click", () => {
      remplirModal(p);
      dialogue.showModal();
    });
  });
}

const searchInput = document.getElementById("search-input");
const typeFilter = document.getElementById("type-filter");
const searchBtn = document.getElementById("searchBtn");

function filtrerPokemon() {
  const searchValue = searchInput ? searchInput.value.trim().toLowerCase() : "";
  const selectedType = typeFilter ? typeFilter.value : "all";

  const resultats = allPokemon.filter((p) => {
    const correspondNom = p.nom.toLowerCase().includes(searchValue);
    const correspondType =
      selectedType === "all" || p.type.some((t) => t.type.name === selectedType);

    return correspondNom && correspondType;
  });

  const grid = document.getElementById("pokemon-grid");

  if (resultats.length === 0) {
    grid.innerHTML = `<p class="no-result">Désolé mais nous n'avons trouvé aucun pokémon.</p>`;
    return;
  }

  afficherPokemon(resultats);
}

if (searchInput) searchInput.addEventListener("input", filtrerPokemon);
if (typeFilter) typeFilter.addEventListener("change", filtrerPokemon);
if (searchBtn) searchBtn.addEventListener("click", filtrerPokemon);

const gridElement = document.getElementById("pokemon-grid");
if (gridElement) {
  gridElement.addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-favori")) {
      const id = parseInt(event.target.dataset.id, 10);

      if (pokemonfavoris.includes(id)) {
        pokemonfavoris = pokemonfavoris.filter((favId) => favId !== id);
        event.target.textContent = "🤍";
      } else {
        pokemonfavoris.push(id);
        event.target.textContent = "❤️";
      }

      majfavcount();
      localStorage.setItem("favoris", JSON.stringify(pokemonfavoris));
    }
  });
}

// Initialisation au chargement
majfavcount();
getData();