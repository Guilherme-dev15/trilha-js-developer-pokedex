const pokemonList = document.getElementById('pokemonList');
const pokemonDetails = document.getElementById('myModal-details-pokemon');
const loadMoreButton = document.getElementById('loadMoreButton');
const maxRecords = 151;
const limit = 9;
let offset = 0;

// Estrutura de dados para armazenar os dados do Pokémon
const pokemonData = {};

function loadPokemonItems(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons
            .map((pokemon) => {
                const statsString = pokemon.stats.map((stat) => `${stat.name}: ${stat.base_stat}`).join('');
                return `
          <li class="pokemon ${pokemon.type}" id="${pokemon.number}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>
            <div class="detail">
              <ol class="types">
                ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
              </ol>
              <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
            <button class="loadDetailButton ${pokemon.type}">Load Details</button>
          </li>`;
            })
            .join('');

        pokemonList.innerHTML += newHtml;

        // Associar os dados do Pokémon a cada elemento
        pokemons.forEach((pokemon) => {
            pokemonData[pokemon.number] = pokemon;
        });
    });
}

function loadPokemonDetails(pokemon) {
    const statsString = pokemon.stats.map((stat) => `${stat.name}: ${stat.base_stat}`).join('');
    const newHtmlStats = `
    <div class="modal-content ${pokemon.type}">
        <div class="modal-header">
            <button id="closeModalBtn" class="close" aria-label="Fechar">&times;</button>
        </div>
      <div class="modal-body" id="modal-body-details">
        <ol id="modal-pokemonListDetails" class="modal-pokemonsDetails">
          <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>
            <div class="detail">
              <ol class="types">
                ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
              </ol>
              <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
          </li>
        </ol>
        <div class="modal-listDetailStats">
          <ol id="modal-pokemon-list-nav" class="pokemons-nav-stats">
            <li class="about-pokemon" id="about" >About</li>
            <li>Base Stats</li>
            <li>Evolution</li>
            <li>Moves</li>
          </ol>
          <ol class="about-pokemon-details" id="baseStats-details">
          ${pokemon.stats
            .map(
                (stat) => `
                <li>
                  <span>${stat.name}</span>
                  <span>${stat.base_stat}</span>
                  <div class="progress-bar">
                  <div class="progress-bar-fill ${stat.base_stat < 50 ? 'red' : 'green'}" id="progress-bar-fill-${stat.name}" style="width: ${stat.base_stat}%"></div>
                  </div>
                </li>
              `
            )
            .join('')}
          </ol>
        </div>
      </div>
    </div>`;

    pokemonDetails.innerHTML = newHtmlStats;

    // Exibir o modal
    pokemonDetails.style.display = 'block';

    // Adicionar evento de fechar o modal
    const closeModalButton = document.getElementById('closeModalBtn');
    closeModalButton.addEventListener('click', closeModal);
 
}

function closeModal() {
    pokemonDetails.style.display = 'none';
}

pokemonList.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('loadDetailButton')) {
        const pokemonId = target.parentElement.id;
        const pokemon = pokemonData[pokemonId];
        loadPokemonDetails(pokemon);
    }
});

loadPokemonItems(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordsWithNextPage = offset + limit;
  
    if (qtdRecordsWithNextPage >= maxRecords) {
      const newLimit = maxRecords - offset;
      loadPokemonItems(offset, newLimit);
  
      loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
      loadPokemonItems(offset, limit);
    }
  });

