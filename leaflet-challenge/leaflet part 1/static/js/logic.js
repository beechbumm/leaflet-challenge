// Create a map object and set the view to a specific location and zoom level
var map = L.map('map').setView([20, 0], 2); // Centered at (20, 0) with zoom level 2

// Add a default tile layer to the map (e.g., OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to load earthquake data and plot it on the map using D3.js
function loadEarthquakeData() {
  // URL to your earthquake data (assuming the file is in the static/data directory)
  var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

  // Use D3.js to fetch the data
  d3.json(url).then(function(data) {
    // Loop through each feature in the GeoJSON data
    data.features.forEach(feature => {
      var coordinates = feature.geometry.coordinates;
      var lat = coordinates[1];
      var lon = coordinates[0];
      var depth = coordinates[2];
      var magnitude = feature.properties.mag;
      var place = feature.properties.place;

      // Create a circle marker and add it to the map
      var marker = L.circleMarker([lat, lon], {
        radius: magnitude * 3, // Adjust the factor as needed for size
        fillColor: getMarkerColor(depth),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(map);

      // Add a popup to the marker
      marker.bindPopup(`Magnitude: ${magnitude}<br>Location: ${place}<br>Depth: ${depth} km`);
    });

    // Add legend after loading data
    addLegend();
  }).catch(function(error) {
    console.log('Error loading earthquake data:', error);
  });
}

// Function to determine marker color based on depth
function getMarkerColor(depth) {
  return depth > 90 ? '#ff5f65' :
         depth > 70 ? '#fca35d' :
         depth > 50 ? '#fdb72a' :
         depth > 30 ? '#f7db11' :
         depth > 10 ? '#dcf400' :
                      '#a3f600';
}

// Function to add legend to the map
function addLegend() {
  var legend = L.control({ position: 'bottomright' });

  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    var depths = [-10, 10, 30, 50, 70, 90];
    var labels = [];

    // Loop through depth intervals and generate a label with a colored square for each interval
    for (var i = 0; i < depths.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getMarkerColor(depths[i] + 1) + '"></i> ' +
        depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
    }

    return div;
  };

  legend.addTo(map);
}

// Call the function to load and plot earthquake data
loadEarthquakeData();
