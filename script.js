
let allPokemons = [];
let currentPokemons = [];
let allPokemonNames = [];
let currentPokemonNames = [];
let searchingInput = "";
let nextUrl = "https://pokeapi.co/api/v2/pokemon?limit=21&offset=0";

function init() {
    fetchDataJson();
}

async function fetchDataJson() {
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
    const myTimeout = setTimeout(showContent, 3000);    
}

function showContent() {
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

    console.log(allPokemons);
    console.log(currentPokemons);
    console.log(allPokemonNames);
    console.log(currentPokemonNames);
    

    for (let indexCurrent = 0; indexCurrent < currentPokemonNames.length; indexCurrent++) {
        for (let index = 0; index < currentPokemons.length; index++) {      
            if(currentPokemons[index].name == currentPokemonNames[indexCurrent]) {
                contentRef.innerHTML += templatePokemonCard(index);
                renderTypes(index); 

                console.log(currentPokemons[index].name);
                console.log(currentPokemonNames[indexCurrent]);
            }
        }           
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

function searchPokemon() {
    let inputRef = document.getElementById("searching");
    
    if(inputRef.value.length >= 3) {
        searchingInput = inputRef.value;
        currentPokemonNames = allPokemonNames.filter(checkPokemons);    
    } else {
        currentPokemonNames = allPokemonNames;
    }        
    renderPokemons();
}

function checkPokemons(name) {
    return name.includes(searchingInput);
  }