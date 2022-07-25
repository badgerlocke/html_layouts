const maxNum = 151; //Max number of pokemon to get. Ex. 151 for only the first 151 from Kanto   TODO: pick different generations

async function getPokemon() {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${maxNum}`);
    const pokemon = await res.json();
    // console.log(pokemon);
    return pokemon.results;
}

function pickFour(pokemon) {
    //Randomly select four pokemon and return as an array
    let picks = []
    console.log(pokemon)
    for (let i=0;i<4;i++) {
        let pokeIndex = Math.floor(maxNum*Math.random());
        console.log(pokemon[pokeIndex])
        picks.push(pokemon[pokeIndex]);
    }
    console.log(picks);
    return picks;
}

async function getChoices () {
    const pokemon = await getPokemon();
    pickFour(pokemon);
}

// function getPokePic({url})