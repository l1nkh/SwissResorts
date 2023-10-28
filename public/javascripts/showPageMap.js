// Get the current time in hours (24-hour format)
const currentHour = new Date().getHours();

// Define a time range for day and night (for example, 6 AM to 6 PM for day)
const isDaytime = currentHour >= 6 && currentHour < 18;

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: isDaytime ? 'mapbox://styles/mapbox/light-v11' : 'mapbox://styles/mapbox/dark-v11',
    center: resort.geometry.coordinates,
    zoom: 8
});

map.addControl(new mapboxgl.NavigationControl());

const marker1 = new mapboxgl.Marker()
    .setLngLat(resort.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${resort.title}</h3><p>${resort.location}</p>`
            )
    )
    .addTo(map);
