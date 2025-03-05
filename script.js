
function init() {
    render();
    fetchDataJson();
}

function render() {
    templatePokemonCard();
}

async function fetchDataJson() {
    let response = await fetch("https://pokeapi.co/api/v2/pokemon/7");
    let responseAsJson = await response.json();
    console.log(responseAsJson.name);
    console.log(responseAsJson.id);
    console.log(responseAsJson.sprites.other.dream_world.front_default);
    console.log(responseAsJson.types[0].type.name);
    //console.log(responseAsJson.types[1].type.name);
    console.log(responseAsJson.stats[0].stat.name);
    console.log(responseAsJson.stats[0].base_stat);
    console.log(responseAsJson.stats[1].stat.name);
    console.log(responseAsJson.stats[1].base_stat);
    console.log(responseAsJson.stats[2].stat.name);
    console.log(responseAsJson.stats[2].base_stat);
    console.log(responseAsJson.stats[3].stat.name);
    console.log(responseAsJson.stats[3].base_stat);
    console.log(responseAsJson.stats[4].stat.name);
    console.log(responseAsJson.stats[4].base_stat);
    console.log(responseAsJson.stats[5].stat.name);
    console.log(responseAsJson.stats[5].base_stat);
    console.log(responseAsJson);
}