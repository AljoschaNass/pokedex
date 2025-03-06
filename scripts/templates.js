function templatePokemonCard(pokemonResponseAsJson, index) {
    return `
        <div id="pokecard_${index}" class="pokecard">
            <div id="pokecard_header" class="pokecard_header">
                <h3>#${pokemonResponseAsJson.id}</h3>
                <h3>${pokemonResponseAsJson.name}</h3>
            </div>
            <div id="pokecard_img" class="pokecard_img">
                <img src="${pokemonResponseAsJson.sprites.other.dream_world.front_default}" alt="${pokemonResponseAsJson.name}-image">
            </div>
            <div id="pokecard_footer_${index}" class="pokecard_footer">
            </div>
        </div>
    `;
}

function templateType(pokemonResponseAsJson,indexType) {
    return `
        <img src="./assets/icons/${pokemonResponseAsJson.types[indexType].type.name}.svg" alt="">
    `;
}