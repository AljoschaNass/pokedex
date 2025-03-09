
let allPokemons = [];
let currentPokemons = [];
let nextUrl = "https://pokeapi.co/api/v2/pokemon?limit=3&offset=0";

function init() {
    fetchDataJson();
}

async function fetchDataJson() {
    let response = await fetch(nextUrl);
    let responseAsJson = await response.json();
    nextUrl = responseAsJson.next;
    savePokemonData(responseAsJson);

    //console.log(responseAsJson);
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

async function savePokemonData(responseAsJson) {
    for (let index = 0; index < responseAsJson.results.length; index++) {
        let pokemonResponse = await fetch(responseAsJson.results[index].url);
        let pokemonResponseAsJson = await pokemonResponse.json();
        allPokemons.push(pokemonResponseAsJson);        
    }
    renderPokemons();
}

function loadMore() {
    fetchDataJson();
}

function disableLoadMoreButton() {
    let disableBtn = document.getElementById("btn_load_more");
    disableBtn.disabled = true;
    disableBtn.classList.add("btn_disabled");
}

function enableLoadMoreButton() {
    let enableBtn = document.getElementById("btn_load_more");
    enableBtn.disabled = false;
    enableBtn.classList.remove("btn_disabled");
}

function renderPokemons() {
    let contentRef = document.getElementById("content");
    contentRef.innerHTML = "";

    for (let index = 0; index < allPokemons.length; index++) {      
        contentRef.innerHTML += templatePokemonCard(index);
        renderTypes(index);    
    }
}

async function renderTypes(index) {
    let contentRef = document.getElementById("pokecard_footer_" + index);
    contentRef.innerHTML = "";

    for (let indexType = 0; indexType < allPokemons[index].types.length; indexType++) {
        contentRef.innerHTML += templateType(index, indexType);   
        if(indexType == 0) {
            setBgColor(index);
        }
    }
}

function renderOverlay(index) {
    //currentPicture = index;
    let singleContentRef = document.getElementById("singleOverlay");
    singleContentRef.innerHTML = "";
    singleContentRef.innerHTML = templateOverlay(index); 
}

function setBgColor(index) {
    let typeRef = document.getElementById("pokecard_" + index);
    typeRef.classList.add("bg_" + allPokemons[index].types[0].type.name);
}

function openOverlay(index) {
    renderOverlay(index);
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

function nextPicture(event, index) {
    let currentIndex = index;
    if(currentIndex< allPokemons.length - 1) {
        currentIndex++;
    } else {
        currentIndex = 0;
    }

    renderOverlay(currentIndex);
    event.stopPropagation();
}

function previousPicture(event, index) {
    let currentIndex = index;
    if(currentIndex > 0) {
        currentIndex--;
    } else {
        currentIndex = allPokemons.length - 1;
    }

    renderOverlay(currentIndex);
    event.stopPropagation();
}

function stopEventBubbling(event) {
    event.stopPropagation();
}

function togglePositionFixed() {
    let contentRef = document.getElementById("content");
    contentRef.classList.toggle("position_fixed");
}