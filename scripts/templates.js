function templatePokemonCard(index) {
    return `
        <div onclick="openOverlay(${index})" id="pokecard_${index}" class="pokecard">
            <div id="pokecard_header" class="pokecard_header">
                <h3>#${allPokemons[index].id}</h3>
                <h3>${allPokemons[index].name}</h3>
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
        <img src="./assets/icons/${allPokemons[index].types[indexType].type.name}.svg" alt="">
    `;
}

function templateOverlay(index) {
    return `    
        <h2>
            ${allPokemons[index].name}
        </h2>
        <img src="${allPokemons[index].sprites.other.dream_world.front_default}" alt="${allPokemons[index].name}-image">
        <div class="control_buttons_overlay">
            <button onclick="previousPicture(event, ${index})" id="previous_button"><</button>
            <span class="current_count">${index + 1} / ${allPokemons.length}</span>
            <button onclick="nextPicture(event, ${index})" id="next_button">></button>
        </div>`
}