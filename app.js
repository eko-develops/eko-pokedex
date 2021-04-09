const form = document.querySelector('#form');
const input = document.querySelector('#poke-search');
const button = document.querySelector('#submit-search');
const pokedexContainer = document.querySelector('div.pokedex-container');



form.addEventListener('submit', (event) =>{
    //prevents form from doing default action (refreshing page/redirecting)
    event.preventDefault();

    //get the input value
    const inputValue = form.elements['poke-search'].value;

    if(inputValue == ''){
        removePokeDiv();
        displayEmptyError();
    } else{
    //Remove errors
    removePokeDiv();
    removeEmptyError();
    removeFetchError();
    //invoke displayPokemon function with input value
    displayPokemon(inputValue.toLowerCase());
    }

})

async function getPokemon(inputValue){
    //store response in variable
    const results = await fetch(`https://pokeapi.co/api/v2/pokemon/${inputValue}`)
    //return the data parsed as json
    .then(response => {
        return response.json();
    })
    //return the data
    .then(data => {
        //console.log(data);
        return data;
    })
    //catch any errors
    .catch(err => {
        //console.log('Error occured while fetching data..', err);
        displayFetchError(err);
    })
    
    //return the results
    return results;

}

function removeFetchError(){
    if (document.querySelector('#fetchErrorDiv')){
        document.querySelector('#fetchErrorDiv').remove();
    }
}

function removeEmptyError(){
    if (document.querySelector('#errorDiv')){
        document.querySelector('#errorDiv').remove();
    }
}

function removePokeDiv(){
    if (document.querySelector('#pokeDiv')){
        document.querySelector('#pokeDiv').remove();
    }
}


function displayEmptyError(){

    if(document.querySelector('#errorDiv')){
        document.querySelector('#errorDiv').remove();
    }

    const errorDiv = document.createElement('div');
    const errorSpan = document.createElement('span');

    
    errorSpan.textContent = 'Cannot search nothing. You must enter a value.';
    errorDiv.id = 'errorDiv';
    errorDiv.style.padding = '0.8rem';
    errorDiv.append(errorSpan);
    form.append(errorDiv);

}

function displayFetchError(err){
    const fetchErrorDiv = document.createElement('div');
    const fetchErrorSpan = document.createElement('span');

    fetchErrorSpan.textContent = 'Unable to find that pokemon. Are you sure it exists?';
    fetchErrorDiv.id = 'fetchErrorDiv';
    fetchErrorDiv.style.padding = '0.8rem';
    fetchErrorDiv.append(fetchErrorSpan);
    form.append(fetchErrorDiv);

    console.log('Error Fetching Data from API.',err);
}

async function displayPokemon(inputValue){
    //get the pokemon data
    const pokemon = await getPokemon(inputValue);

    //create a pokemon object
    const pokeObj = {
        name: pokemon.name,
        weight: pokemon.weight,
        id: pokemon.id,
        abilities: pokemon.abilities,
        moves: pokemon.moves,
        image: pokemon.sprites.other['dream_world']['front_default'],
    }

    //create DOM objects
    const img = document.createElement('img');  //for pokemon image
    const pokeNameLabel = document.createElement('span'); //for the pokemon name
    const id = document.createElement('span');  //for the pokemon id
    const weight = document.createElement('span'); //for the weight
    const headerH2 = document.createElement('h2'); //For the information header
    const pokeDiv = document.createElement('div');  //hold all poke info
    
    pokeDiv.id = 'pokeDiv';

    //set the image source to the image object
    img.src = pokeObj.image;

    //Set the header for information
    headerH2.textContent = 'Information';

    //Set the text content for the name
    pokeNameLabel.textContent = `Name: ${pokeObj.name}`;
    pokeNameLabel.classList.toggle('capitalize');

    //Set the text content for the id
    id.textContent = `ID: ${pokeObj.id}`;

    //Set the text for weight
    weight.textContent = `Weight: ${pokeObj.id}`;

    //Get an array of abilities from the abilities object
    /*
    Initialize a variable to map the abilities property (contains objects)
    in pokeObj. For each object in pokemon['abilities'], map the name
    to a new object in abilitiesObj. Return abilitiesObj as a new array.
    With this new array, I can access EACH ability.
    */
    const pokeAbilities = pokeObj['abilities'].map(element => {
        const abilitiesObj = {}; //initialize empty object to collect abilities
        abilitiesObj.name = element.ability.name;
        //abilitiesObj.url = element.ability.url;
        return abilitiesObj;
    })

    //Create a div for abilities
    const abilityDiv = document.createElement('div');
    const abilityH3 = document.createElement('h3');
    abilityH3.textContent = 'Abilities';
    abilityDiv.append(abilityH3);
    //append abilities to DOM
    pokeAbilities.forEach(ability => {
        //create a span
        const abilitySpan = document.createElement('span');
        
        //assign the ability name to the span
        abilitySpan.textContent = ability.name;
        abilitySpan.classList.toggle('capitalize');
     

        //append the span to the ability div
        abilityDiv.append(abilitySpan);
    });
    //End abilities


    // const pokeMoves = pokeObj['moves'].map(element => {
    //     const movesObj = {}; //initialize empty object to collect abilities
    //     movesObj.name = element.move.name;
    //     //movesObj.url = element.move.url;
    //     return movesObj;
    // })

    // //Create a div for moves
    // const movesDiv = document.createElement('div');
    // const movesH3 = document.createElement('h3');
    // movesH3.textContent = 'Moves';
    // movesDiv.append(movesH3);
    // //append abilities to DOM
    // pokeMoves.forEach(ability => {
    //     //create a span
    //     const moveSpan = document.createElement('span');
        
    //     //assign the ability name to the span
    //     moveSpan.textContent = ability.name;
    //     moveSpan.classList.toggle('capitalize');
     

    //     //append the span to the ability div
    //     movesDiv.append(moveSpan);
    // });
    // //End abilities


    pokeDiv.append(img);
    pokeDiv.append(headerH2);
    pokeDiv.append(pokeNameLabel);
    pokeDiv.append(id);
    pokeDiv.append(weight);

    //Append abilities under information
    pokeDiv.append(abilityDiv);
   // pokeDiv.append(movesDiv);

    //After everything appended to pokeDiv, append to poke container
    pokedexContainer.append(pokeDiv);

}