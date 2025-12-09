/* Arquivo: card.js
   Correção: Força a cor do card a corresponder à página atual (Solo, Voador, etc.)
*/

// 1. Elementos e Cores
const grid = document.getElementById("grid") ||
             document.getElementById("container-solo") ||
             document.getElementById("container-voador") ||
             document.getElementById("container-psiquico") ||
             document.getElementById("container-inseto");

const typeColors = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  steel: "#B7B7CE",
  fairy: "#D685AD",
  dark: "#705746",
};

// Variável global para guardar o contexto da página (ex: 'ground')
let pageContextType = null;

// 2. Função de Busca
async function fetchAndCreateCard(pokemonInput) {
  try {
    const url = pokemonInput.toString().startsWith('http')
        ? pokemonInput
        : `https://pokeapi.co/api/v2/pokemon/${pokemonInput}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Erro na API');
   
    const data = await response.json();
    createCardHTML(data);
   
  } catch (error) {
    console.error("Erro:", error);
  }
}

// 3. Função de Criação do HTML
function createCardHTML(data) {
  if (!grid) return;

  const name = data.name;
  const id = data.id.toString().padStart(3, "0");
  const imgUrl = data.sprites.other["official-artwork"].front_default || data.sprites.front_default;
  const height = data.height / 10;
  const weight = data.weight / 10;
 
  const abilities = data.abilities
    .map((a) => a.ability.name.replace('-', ' '))
    .slice(0, 2)
    .join(", ");

  const stats = {};
  data.stats.forEach((s) => (stats[s.stat.name] = s.base_stat));
  const atk = stats["attack"] || 0;
  const def = stats["defense"] || 0;


  // Se temos um contexto de página (ex: estamos na página Ground), usamos essa cor.
  // Caso contrário (ex: página home ou busca genérica), usamos o primeiro tipo do Pokémon.
  let mainType;
 
  if (pageContextType && typeColors[pageContextType]) {
      // Força o tipo da página (ex: ground)
      mainType = pageContextType;
  } else {
      // Comportamento padrão (pega o primeiro tipo)
      mainType = data.types[0].type.name;
  }
 
  const color = typeColors[mainType] || "#777";
  
  const typesHtml = data.types
    .map((t) => {
      const tName = t.type.name;
      const tColor = typeColors[tName] || "#777";
      return `<span style="background-color: ${tColor}; padding: 3px 8px; border-radius: 10px; color: white; font-size: 0.75rem; text-transform: uppercase; margin-right: 5px;">${tName}</span>`;
    })
    .join("");

  const card = document.createElement("div");
  card.classList.add("cartao-pokemon");
  card.style.borderTop = `4px solid ${color}`;

  card.innerHTML = `
        <div class="cabecalho-cartao" style="background: linear-gradient(135deg, ${color}, white);">
            <div class="container-img-poke">
                <img src="${imgUrl}" alt="${name}" class="imagem-pokemon">
            </div>
            <h3 class="nome-pokemon">${name}</h3>
        </div>
       
        <div class="corpo-cartao">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <span style="color: #888; font-weight: bold;">#${id}</span>
                <div class="lista-habilidades">${typesHtml}</div>
            </div>
           
            <div class="linha-estatistica">
                <span class="rotulo-estatistica">Altura</span>
                <span class="valor-estatistica">${height} m</span>
            </div>
            <div class="linha-estatistica">
                <span class="rotulo-estatistica">Peso</span>
                <span class="valor-estatistica">${weight} kg</span>
            </div>

            <div class="linha-estatistica" style="flex-direction: column; align-items: flex-start; margin-top: 10px;">
                <span class="rotulo-estatistica">Habilidades:</span>
                <span style="text-transform: capitalize; font-size: 0.85rem;">${abilities}</span>
            </div>

            <div class="barras-status" style="margin-top: 15px;">
                <div class="container-barra">
                    <span class="rotulo-barra">ATK</span>
                    <div class="fundo-barra">
                        <div class="barra-preenchimento" style="width: ${Math.min(atk, 100)}%; background-color: ${color}"></div>
                    </div>
                    <span style="margin-left: 5px; font-size: 0.7em;">${atk}</span>
                </div>
               
                <div class="container-barra">
                    <span class="rotulo-barra">DEF</span>
                    <div class="fundo-barra">
                        <div class="barra-preenchimento" style="width: ${Math.min(def, 100)}%; background-color: ${color}"></div>
                    </div>
                    <span style="margin-left: 5px; font-size: 0.7em;">${def}</span>
                </div>
            </div>
        </div>
  `;

  grid.appendChild(card);
}

// 4. Inicialização Automática
(async function init() {
 
  // Define o pageContextType antes de chamar a API
  if (document.getElementById('container-solo')) {
     pageContextType = 'ground'; // Força cor Ground
     const res = await fetch('https://pokeapi.co/api/v2/type/ground');
     const data = await res.json();
     data.pokemon.slice(0, 12).forEach(p => fetchAndCreateCard(p.pokemon.url));
  }
  else if (document.getElementById('container-voador')) {
     pageContextType = 'flying'; // Força cor Flying
     const res = await fetch('https://pokeapi.co/api/v2/type/flying');
     const data = await res.json();
     data.pokemon.slice(0, 12).forEach(p => fetchAndCreateCard(p.pokemon.url));
  }
  else if (document.getElementById('container-psiquico')) {
     pageContextType = 'psychic'; // Força cor Psychic
     const res = await fetch('https://pokeapi.co/api/v2/type/psychic');
     const data = await res.json();
     data.pokemon.slice(0, 12).forEach(p => fetchAndCreateCard(p.pokemon.url));
  }
  else if (document.getElementById('container-inseto')) {
     pageContextType = 'bug'; // Força cor Bug
     const res = await fetch('https://pokeapi.co/api/v2/type/bug');
     const data = await res.json();
     data.pokemon.slice(0, 12).forEach(p => fetchAndCreateCard(p.pokemon.url));
  }
  else if (document.getElementById('grid')) {
     pageContextType = null; // Sem contexto, usa a cor do Pokémon
     await fetchAndCreateCard("pikachu");
  }

})();