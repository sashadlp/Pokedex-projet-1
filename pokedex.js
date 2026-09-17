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

document.getElementById('searchBtn').addEventListener('click', () => {
        const name = document.getElementById('searchChampion').value.trim();
        if (!name) return;
 
        fetch('APISite.php?champions=1')
            .then(r => r.json())
            .then(data => {
                const champions = Object.entries(data.data);
                const found = champions.find(([key, champ]) =>
                    champ.name.toLowerCase() === name.toLowerCase()
                );
 
                if (!found) {
                    document.getElementById('championDetail').innerHTML = `<p>Champion "${name}" introuvable.</p>`;
                    return;
                }
 
                const [key] = found;
                showDetail(key);
            })
            .catch(err => console.error('Erreur :', err));
    });