let keyAPI;

async function getKeyAPI() {
    try {
        // Make a POST request to get the API key
        const answer = await fetch('https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/keys', {
            method: 'POST'
        });
        // Extract JSON data from the response
        const data = await answer.json();
        // Stores the API key in the keyAPI global variable
        keyAPI = data.key;
        console.log('API key is:', keyAPI); //Check if everything works well

        // After obtaining the API key, call the function to obtain information about celestial bodies
        getPlanetsInformation();

    } catch (erro) {
        console.error('Error getting API key:', erro);
    }
}

async function getPlanetsInformation() {
    try {
        // Make a GET request to obtain information about celestial bodies
        const answer = await fetch('https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies', {
            method: 'GET',
            headers: {
                'x-zocom': keyAPI
            }
        });
        // Extract JSON data from the response
        const data = await answer.json();
        console.log('Information about the planets:', data); //Check if everything works well

// Iterates over the celestial bodies in the array and creates HTML elements for each one
data.bodies.forEach(celestialBody => {
    console.log('Celestial body:', celestialBody.name);
    const celestialBodyElement = document.createElement('div');
    celestialBodyElement.classList.add('celestial-body', `body-${celestialBody.name.toLowerCase()}`);

    // Add a click event to show celestial body information
    celestialBodyElement.addEventListener('click', () => showCelestialBodyInformation(celestialBody));

    // Update the planet icon with the corresponding class
    const planetIcon = document.getElementById('planet-icon');
    planetIcon.className = ""; // Remove previous classes
    planetIcon.classList.add('planet-icon', `body-${celestialBody.name.toLowerCase()}`);

    // Adds the celestial body element to the container
    document.getElementById('planet-container').appendChild(celestialBodyElement);
});

// Find the Sun in API data
const sunData = data.bodies.find(body => body.type === 'star');

// Dynamically adds click event for Sun
const sunElement = document.getElementById('sun');
sunElement.addEventListener('click', () => showCelestialBodyInformation(sunData));

    } catch (erro) {
        console.error('Erro obtaining information about planets:', erro);
    }
}

// Call the function to start the process
getKeyAPI();

function showCelestialBodyInformation(celestialBody) {
    const overlay = document.getElementById('overlay');
    const planetIcon = document.getElementById('planet-icon');

     planetIcon.className = 'planet-icon';

     // Add specific planet or star class
    if (celestialBody.type === 'star') {
        planetIcon.classList.add('star');
    } else {
        planetIcon.classList.add(`body-${celestialBody.name.toLowerCase()}`);
    }

    // Update information elements with data from the celestial body
    if (celestialBody.type && celestialBody.type === 'star') {
        document.getElementById('planet-name').innerHTML = `<span>${celestialBody.name}</span>`;
        document.getElementById('planet-latinName').innerHTML = `<span>${celestialBody.latinName}</span>`;
        document.getElementById('planet-desc').innerHTML = `${celestialBody.desc}`; 
        document.getElementById('planet-circumference').innerHTML = `<span>Omkrets:</span> <br> ${celestialBody.circumference}`;
        document.getElementById('planet-max-temp').innerHTML = `<span>Max. temperatur:</span> <br> ${celestialBody.temp.day} °C`;
        document.getElementById('planet-min-temp').innerHTML = `<span>Min. temperatur:</span> <br> ${celestialBody.temp.night} °C`;
    
    } else {

        document.getElementById('overlay-content').classList.remove('overlay-content-sat-net');

        document.getElementById('planet-name').innerHTML = `<span>${celestialBody.name}</span>`;
        document.getElementById('planet-latinName').innerHTML = `<span>${celestialBody.latinName}</span>`;
        document.getElementById('planet-desc').innerHTML = `${celestialBody.desc}`;   
        document.getElementById('planet-circumference').innerHTML = `<span>Omkrets: </span><br> ${celestialBody.circumference}`;
        document.getElementById('planet-max-temp').innerHTML = `<span>Max. Temperatur:</span> <br> ${celestialBody.temp.day} °C`;
        document.getElementById('planet-min-temp').innerHTML = `<span>Min. Temperatur:</span> <br> ${celestialBody.temp.night} °C`;
        document.getElementById('planet-moons').innerHTML = `<span>Månar:</span> <br> ${celestialBody.moons}`;
        
        // If the celestial body is a planet, display the distance from the Sun
        if (celestialBody.type === 'planet') {
        document.getElementById('planet-distance').innerHTML = `<span>Km från solen:</span> <br> ${celestialBody.distance} km`;
    }

    if (celestialBody.name === 'Saturnus' || celestialBody.name === 'Neptunus') {
        document.getElementById('overlay-content').classList.add('overlay-content-sat-net');
    } 
    
    }

    overlay.style.display = 'block';
}

function closeOverlay() {
    document.getElementById('overlay').style.display = 'none';
}