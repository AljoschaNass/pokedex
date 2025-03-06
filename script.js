
function init() {
    //render();
    fetchDataJson();
}

async function render(responseAsJson) {
    let contentRef = document.getElementById("content");
    contentRef.innerHTML = "";

    for (let index = 0; index < responseAsJson.results.length; index++) {
        let pokemonResponse = await fetch(responseAsJson.results[index].url);
        let pokemonResponseAsJson = await pokemonResponse.json();
        console.log(pokemonResponseAsJson);
        contentRef.innerHTML += templatePokemonCard(pokemonResponseAsJson, index);
        renderTypes(pokemonResponseAsJson, index);    
    }
}

async function renderTypes(pokemonResponseAsJson, index) {
    let contentRef = document.getElementById("pokecard_footer_" + index);
    contentRef.innerHTML = "";

    for (let indexType = 0; indexType < pokemonResponseAsJson.types.length; indexType++) {
        contentRef.innerHTML += templateType(pokemonResponseAsJson, indexType);   
        if(indexType == 0) {
            setBgColor(pokemonResponseAsJson, index);
        }
    }
}

function setBgColor(pokemonResponseAsJson, index) {
    let typeRef = document.getElementById("pokecard_" + index);
    typeRef.classList.add("bg_" + pokemonResponseAsJson.types[0].type.name);
}

async function fetchDataJson() {
    let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=39&offset=0");
    let responseAsJson = await response.json();

    render(responseAsJson);

    //console.log(responseAsJson.name);
    //console.log(responseAsJson.id);
    //console.log(responseAsJson.sprites.other.dream_world.front_default);
    //console.log(responseAsJson.types[0].type.name);
    //console.log(responseAsJson.types[1].type.name);
    //console.log(responseAsJson.stats[0].stat.name);
    //console.log(responseAsJson.stats[0].base_stat);
    //console.log(responseAsJson.stats[1].stat.name);
    //console.log(responseAsJson.stats[1].base_stat);
    //console.log(responseAsJson.stats[2].stat.name);
    //console.log(responseAsJson.stats[2].base_stat);
    //console.log(responseAsJson.stats[3].stat.name);
    //console.log(responseAsJson.stats[3].base_stat);
    //console.log(responseAsJson.stats[4].stat.name);
    //console.log(responseAsJson.stats[4].base_stat);
    //console.log(responseAsJson.stats[5].stat.name);
    //console.log(responseAsJson.stats[5].base_stat);
    //console.log(responseAsJson);
    //console.log(responseAsJson.results);
    //console.log(responseAsJson.results[0].name);
    //console.log(responseAsJson.results[0].url);  
}

function openOverlay() {
    let overlayRef = document.getElementById("overlay");
    overlayRef.classList.remove("d_none");
    overlayRef.classList.add("d_flex");
    togglePositionFixed();
}

function closeOverlay() {
    let overlayRef = document.getElementById("overlay");
    overlayRef.classList.add("d_none");
    overlayRef.classList.remove("d_flex");
    togglePositionFixed();
}

function nextPicture(event) {
    if(currentPicture < pictureName.length - 1) {
        currentPicture++;
    } else {
        currentPicture = 0;
    }

    renderSingle(currentPicture);
    event.stopPropagation();
}

function previousPicture(event) {
    if(currentPicture > 0) {
        currentPicture--;
    } else {
        currentPicture = 10;
    }

    renderSingle(currentPicture);
    event.stopPropagation();
}

function stopEventBubbling(event) {
    event.stopPropagation();
}

function togglePositionFixed() {
    let contentRef = document.getElementById("content");
    contentRef.classList.toggle("position_fixed");
}