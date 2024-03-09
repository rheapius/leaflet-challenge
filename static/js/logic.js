url= "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

myMap= L.map("map",{
    center: [11.62337, 92.726486],
    zoom: 3});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);
      
d3.json(url).then(function(data) {
    console.log(data);
    createfeatures(data.features);
});

function createfeatures(earthquakeData) {
    
    depthScale = d3.scaleSequential(d3.interpolateYlOrRd).domain([0, d3.max(earthquakeData, d => d.geometry.coordinates[2])]);

    earthquakeData.forEach(feature => {
        let coordinates= feature.geometry.coordinates;
        let magnitude= feature.properties.mag;
        let depth= coordinates[2];
        color= depthScale(depth);

        let circle= L.circle([coordinates[1],coordinates[0]], {
            radius: magnitude *50000,
            color: color,
            fillOpacity: 0.75
        }).addTo(myMap);

        circle.bindPopup('<h2> Magnitude: '+feature.properties.mag+'</h2><hr><h3>'+feature.properties.place+'</h3><hr><p>Depth: '+feature.geometry.coordinates[2]+'</p>');
    });

    //creating map legend//
    
    legend = L.control({ position: 'bottomright' });
    legend.onAdd = function () {
        div = L.DomUtil.create('div', 'info legend');
        depthRanges = depthScale.ticks(5); 
        
        div.innerHTML += '<strong>Depth</strong><br>';
        
        for (let i = 0; i < depthRanges.length-1; i++) {
            startDepth = depthRanges[i];
            endDepth = depthRanges[i + 1];
            color = depthScale((startDepth + endDepth) / 2);

            div.innerHTML +=
            `<div class="legend-item"><div class="color-swatch" style="background:${color}"></div>${startDepth} &ndash; ${endDepth} </div>`;
    }
  
      return div;
    };
    legend.addTo(myMap);
}



 
