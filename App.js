var map;

async function getCoords() {
    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        return [position.coords.latitude, position.coords.longitude];
    } catch (error) {
        console.error('Error getting coordinates:', error);
        return null;
    }
}

function initializeMap(coords) {
    map = L.map('map').setView(coords, 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    var marker = L.marker(coords).addTo(map);
    marker.bindPopup("<b>Location</b><br>You are here!").openPopup();
}

function performLocationSearch(businessType) {
    getCoords().then((coords) => {
        if (coords) {
            const baseUrl = 'https://api.example.com/places';
            const queryParams = {
                type: businessType,
                lat: coords[0],
                lng: coords[1],
                limit: 5
            };

            const url = new URL(baseUrl);
            url.search = new URLSearchParams(queryParams).toString();

            fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    map.eachLayer((layer) => {
                        if (layer instanceof L.Marker) {
                            map.removeLayer(layer);
                        }
                    });
                    data.forEach((place) => {
                        const marker = L.marker([place.latitude, place.longitude]).addTo(map);
                        marker.bindPopup(`<b>${place.name}</b>`).openPopup();
                    });
                })
        }
    });
}

const dropdown = document.getElementById('spots');
const submitButton = document.getElementById('submit');

submitButton.addEventListener('click', function () {
    const selectedBusinessType = dropdown.value;
    performLocationSearch(selectedBusinessType);
});

getCoords().then((coords) => {
    if (coords) {
        initializeMap(coords);
    }
});

