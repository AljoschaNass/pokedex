function templatePokemonCard(index, indexCurrent) {
    return `
        <div onclick="openOverlay(${indexCurrent})" id="pokecard_${index}" class="pokecard">
            <div id="pokecard_header" class="pokecard_header">
                <h3>#${allPokemons[index].id}</h3>
                <h3 class="pokemon_name">${allPokemons[index].name}</h3>
            </div>
            <div id="pokecard_img" class="pokecard_img">
                <img src="${allPokemons[index].sprites.other.dream_world.front_default}" alt="${allPokemons[index].name}-image">
            </div>
            <div id="pokecard_footer_${index}" class="pokecard_footer">
            </div>
        </div>
    `;
}

function templateType(index,indexType) {
    return `
        <img src="./assets/icons/${currentPokemons[index].types[indexType].type.name}.svg" alt="">
    `;
}

function templateOverlay(indexCurrent) {
    return `    
        <h2 class="pokemon_name">${currentPokemons[indexCurrent].name}</h2>
        <img src="${currentPokemons[indexCurrent].sprites.other.dream_world.front_default}" alt="${currentPokemons[indexCurrent].name}-image">
        <div class="control_buttons_overlay">
            <button onclick="previousPokemon(event, ${indexCurrent})" id="previous_button"><</button>
            <span class="current_count">${indexCurrent + 1} / ${currentPokemons.length}</span>
            <button onclick="nextPokemon(event, ${indexCurrent})" id="next_button">></button>
        </div>`
}