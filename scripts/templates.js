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
        <div class="overlay_img_section">
            <div id="overlay_types" class="overlay_types">
                <img class="overlay_type_icons" src="./assets/icons/grass.svg" alt="">
                <img class="overlay_type_icons" src="./assets/icons/poison.svg" alt="">
            </div>
            <img class="overlay_img" src="${currentPokemons[indexCurrent].sprites.other.dream_world.front_default}" alt="${currentPokemons[indexCurrent].name}-image">
        </div>
        <div class="overlay_stats">
            <div class="overlay_links">
                <a onclick="setOverlayStats('about')" id="about_link" class="selected" href="#about_link">About</a>
                <a onclick="setOverlayStats('base_stats')" id="base_stats_link" href="#base_stats_link">Base Stats</a>
                <a onclick="setOverlayStats('evolution')" id="evolution_link" href="#evolution_link">Evolution</a>
                <a onclick="setOverlayStats('moves')" id="moves_link" href="#moves_link">Moves</a>
            </div>
            <div id="about_section" class="about d_none">
                <table>
                    <tr>
                        <td>Species</td>
                        <td>Seed</td>
                    </tr>
                    <tr>
                        <td>Height</td>
                        <td>0,${currentPokemons[indexCurrent].height}0cm</td>
                    </tr>
                    <tr>
                        <td>Weight</td>
                        <td>6,9kg</td>
                    </tr>
                    <tr>
                        <td>Abilities</td>
                        <td>${currentPokemons[indexCurrent].abilities[0].ability}</td>
                    </tr>
                    <tr>
                        <td><strong>Breeding</strong></td>
                    </tr>
                    <tr>
                        <td>Gender</td>
                        <td>87.5% männlich</td>
                    </tr>
                    <tr>
                        <td>Egg Groups</td>
                        <td>Monster</td>
                    </tr>
                    <tr>
                        <td>Egg Cycle</td>
                        <td>Grass</td>
                    </tr>
                </table>
            </div>
            <div id="base_stats_section" class="base_stats d_none">
                <table>
                    <tr>
                        <td>HP</td>
                        <td>${currentPokemons[indexCurrent].stats[0].base_stat}</td>
                    </tr>
                    <tr>
                        <td>Attack</td>
                        <td>${currentPokemons[indexCurrent].stats[1].base_stat}</td>
                    </tr>
                    <tr>
                        <td>Defense</td>
                        <td>${currentPokemons[indexCurrent].stats[2].base_stat}</td>
                    </tr>
                    <tr>
                        <td>Sp. Atk</td>
                        <td>${currentPokemons[indexCurrent].stats[3].base_stat}</td>
                    </tr>
                    <tr>
                        <td>Sp. Def</td>
                        <td>${currentPokemons[indexCurrent].stats[4].base_stat}</td>
                    </tr>
                    <tr>
                        <td>Speed</td>
                        <td>${currentPokemons[indexCurrent].stats[5].base_stat}</td>
                    </tr>
                    <tr>
                        <td>Total</td>
                        <td>${currentPokemons[indexCurrent].stats[0].base_stat 
                            + currentPokemons[indexCurrent].stats[1].base_stat 
                            + currentPokemons[indexCurrent].stats[2].base_stat 
                            + currentPokemons[indexCurrent].stats[3].base_stat 
                            + currentPokemons[indexCurrent].stats[4].base_stat 
                            + currentPokemons[indexCurrent].stats[5].base_stat}</td>
                    </tr>
                </table>
            </div>
            <div id="evolution_section" class="evolution d_none">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/1.svg" alt="">
                <h2>>></h2>
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/2.svg" alt="">
                <h2>>></h2>
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/3.svg" alt="">
            </div>
            <div id="moves_section" class="moves d_none">
    
            </div>
        </div>
        <div class="control_buttons_overlay">
            <button onclick="previousPokemon(event, ${indexCurrent})" id="previous_button"><</button>
            <span class="current_count">${indexCurrent + 1} / ${currentPokemons.length}</span>
            <button onclick="nextPokemon(event, ${indexCurrent})" id="next_button">></button>
        </div>
        
        
        `
}