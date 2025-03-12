
let allPokemons = [];
let currentPokemons = [];
let allPokemonNames = [];
let currentPokemonNames = [];
let searchingInput = "";
let nextUrl = "https://pokeapi.co/api/v2/pokemon?limit=21&offset=0";

let input = document.getElementById("searching");
input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("btn_search").click();
  }
});

function init() {
    fetchDataJson();
}

async function fetchDataJson() {
    disableLoadMoreButton();
    let response = await fetch(nextUrl);
    let responseAsJson = await response.json();
    nextUrl = responseAsJson.next;
    savePokemonData(responseAsJson);
}

async function savePokemonData(responseAsJson) {
    for (let index = 0; index < responseAsJson.results.length; index++) {
        let pokemonResponse = await fetch(responseAsJson.results[index].url);
        let pokemonResponseAsJson = await pokemonResponse.json();
        allPokemons.push(pokemonResponseAsJson);   
        allPokemonNames.push(pokemonResponseAsJson.name);   
    }
    currentPokemons = allPokemons;   
    currentPokemonNames = allPokemonNames; 
    renderPokemons();
    const myTimeout = setTimeout(showContent, 2000);    
}

function showContent() {
    enableLoadMoreButton();
    let loadingScreenRef = document.getElementById("loading_screen");
    let contentRef = document.getElementById("content");

    loadingScreenRef.classList.add("d_none");
    contentRef.classList.remove("d_none");
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
    currentPokemons = [];

    for (let indexCurrent = 0; indexCurrent < currentPokemonNames.length; indexCurrent++) {
        for (let index = 0; index < allPokemons.length; index++) {      
            if(allPokemons[index].name == currentPokemonNames[indexCurrent]) {
                contentRef.innerHTML += templatePokemonCard(index, indexCurrent);
                currentPokemons.push(allPokemons[index])
                renderTypes(index, indexCurrent); 
            }
        }           
    }
}

async function renderTypes(index, indexCurrent) {
    let contentRef = document.getElementById("pokecard_footer_" + index);
    contentRef.innerHTML = "";

    for (let indexType = 0; indexType < currentPokemons[indexCurrent].types.length; indexType++) {
        contentRef.innerHTML += templateType(indexCurrent, indexType);   
        if(indexType == 0) {
            setBgColor(index, indexCurrent);
        }
    }
}

function renderOverlay(indexCurrent) {
    let singleContentRef = document.getElementById("singleOverlay");
    singleContentRef.innerHTML = "";
    singleContentRef.innerHTML = templateOverlay(indexCurrent); 
}

function setBgColor(index, indexCurrent) {
    let typeRef = document.getElementById("pokecard_" + index);
    typeRef.classList.add("bg_" + currentPokemons[indexCurrent].types[0].type.name);
}

function openOverlay(indexCurrent) {
    renderOverlay(indexCurrent);
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

function nextPokemon(event, index) {
    let currentIndex = index;
    if(currentIndex< currentPokemons.length - 1) {
        currentIndex++;
    } else {
        currentIndex = 0;
    }

    renderOverlay(currentIndex);
    event.stopPropagation();
}

function previousPokemon(event, index) {
    let currentIndex = index;
    if(currentIndex > 0) {
        currentIndex--;
    } else {
        currentIndex = currentPokemons.length - 1;
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

function searchPokemon() {
    let inputRef = document.getElementById("searching");
    let inputRefLow = inputRef.value.toLowerCase();
        
    if(inputRefLow.length >= 3) {
        searchingInput = inputRefLow;
        currentPokemonNames = allPokemonNames.filter(checkPokemons);    
        inputRef.value = "";
    } else {
        currentPokemonNames = allPokemonNames;
    }            
    renderPokemons();
}

function checkPokemons(name) {
    return name.includes(searchingInput);
  }