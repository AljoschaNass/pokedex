function templatePokemonCard(pokemonResponseAsJson) {
    return `
        <div class="pokecard bg_grass">
            <div id="pokecard_header" class="pokecard_header">
                <h3>#${pokemonResponseAsJson.id}</h3>
                <h3>${pokemonResponseAsJson.name}</h3>
            </div>
            <div id="pokecard_img" class="pokecard_img">
                <img src="${pokemonResponseAsJson.sprites.other.dream_world.front_default}" alt="${pokemonResponseAsJson.name}-image">
            </div>
            <div id="pokecard_footer" class="pokecard_footer">
            </div>
        </div>
    `;
}