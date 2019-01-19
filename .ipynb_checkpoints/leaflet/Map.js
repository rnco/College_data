function createMap(markerlayer) {

    // Create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: API_KEY
    });
  
    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
      "Light Map": lightmap
    };
  
    // Create an overlayMaps object to hold the bikeStations layer
    var overlayMaps = {
      "College Locations": markerlayer
    };
  
    var map = L.map("map", {
      center: [39.0997265, -94.5785667],
      zoom: 4,
      layers: [lightmap, markerlayer]
    });
  
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);
  }
  
  function createMarkers(collegeloc) {
    var collegeMarkers = [];
    for (var index = 0; index < collegeloc.length; index++) {
      var chronname = collegeloc [index];  
      


  
      var collegeMarker = L.marker([chronname.latitude, chronname.longitude])
        .bindPopup("<h3>" + chronname.chronname + "<h3><h3>Location: " + chronname.city + ', ' + chronname.state + "<h3>");
  
      collegeMarkers.push(collegeMarker);
    }
  
    createMap(L.layerGroup(collegeMarkers));
  }
  
  
  d3.json("data.json", createMarkers);
  

  

  