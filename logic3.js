// Store our API endpoint inside queryUrl
// var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";
// var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  function styleMarkers(marker) {
    console.log(marker);
    return {
      color: "#000000",
      opacity: 1,
      fillOpacity: 0.7,
      fillColor: colorDetermine(marker.properties.mag),
      radius: marker.properties.mag * 5
    };
  }

  // function colorDetermine(mag) {
  //   if (mag <= 1) {
  //     return "#00FF00";
  //   } else if (mag <= 2) {
  //     return "#99ff00";
  //   } else if (mag <= 3) {
  //     return "#FFFF00";
  //   } else if (mag <= 4) {
  //     return "#FF4F00";
  //   } else if (mag <= 5) {
  //     return "#FF0000";
  //   } else {
  //     return "#800000";
  //   }
  // }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function(feature, latlong) {
      return L.circleMarker(latlong);
    },
    style: styleMarkers
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function colorDetermine(mag) {
  if (mag <= 1) {
    return "#00FF00";
  } else if (mag <= 2) {
    return "#99ff00";
  } else if (mag <= 3) {
    return "#FFFF00";
  } else if (mag <= 4) {
    return "#FF4F00";
  } else if (mag <= 5) {
    return "#FF0000";
  } else {
    return "#800000";
  }
}

// Define a function we want to run once for each feature in the features array
// Give each feature a popup describing the place and time of the earthquake
function onEachFeature(feature, layer) {
  layer.bindPopup(
    "<h3>" +
      feature.properties.place +
      "</h3><hr><p>" +
      new Date(feature.properties.time) +
      "</h3><hr><p>" +
      "Magnitude:" +
      " " +
      feature.properties.mag +
      "</p>"
  );
}

function createMap(earthquakes) {
  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control
    .layers(baseMaps, overlayMaps, {
      collapsed: false
    })
    .addTo(myMap);

  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function(myMap) {
    var div = L.DomUtil.create("div", "info legend");
    (labels = ["<strong>Earthquakes in last 30 Days (Magnitude)</strong>"]), (categories = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"]);

    function LegendColor(categories) {
      if (categories === "0-1") {
        return "#00FF00";
      } else if (categories === "1-2") {
        return "#99ff00";
      } else if (categories === "2-3") {
        return "#FFFF00";
      } else if (categories === "3-4") {
        return "#FF4F00";
      } else if (categories === "4-5") {
        return "#FF0000";
      } else {
        return "#800000";
      }
    }


    for (var i = 0; i < categories.length; i++) {
      div.innerHTML += labels.push(
        '<i style="background:' +
          LegendColor(categories[i]) +
          '"></i> ' +
          (categories[i] ? categories[i] : "+")
      );
    }
    div.innerHTML = labels.join("<br>");
    return div;
  };
  legend.addTo(myMap);
}
