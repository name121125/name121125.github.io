
// 查詢經過路線
async function getBusRoutes(BusNode) {
    let query = `[out:json];
        node(${BusNode});     // 查詢公車站 Node ID
        relation(bn)["route"="bus"];  // 查詢包含該節點的公車路線
        (._;>;);
        out geom;`;
    let url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    let response = await fetch(url);
    let data = await response.json();
    return data;// 一開始回傳element導致分析時發生element is undefined錯誤
}

async function routeDisplay(route_name) {
    console.log(route_name);
    let query = `[out:json][timeout:25];
        area(id:3601293250)->.searchArea;
        nwr["name"='${route_name}'];  
        (._;>;);
        out;`;
    let url = `https://overpass-api.de/api/interpreter?data=${query}`;
    console.log(url);
    let response = await fetch(url);
    const data = await response.json();
    console.log(data);
    const Busroute_geojson_data = osmtogeojson(data);
    console.log(Busroute_geojson_data);
    console.log(Busroute_geojson_data.features[0].name);
    if (BusrouteLayer != null) {
        BusrouteLayer.clearLayers(); // 清除舊的圖層
    }

    BusrouteLayer = L.geoJSON(Busroute_geojson_data, {
        style: function (feature) {
            switch (feature.geometry.type) {
                case 'MultiLineString':
                    return {
                        color: "blue",
                        weight: 3,
                        opacity: 0.7

                    };
                case 'LineString':
                        return {
                            color: "red",
                            weight: 3,
                            opacity: 0.7
                    };
                
            }
        },
        pointToLayer: function (feature, latlng) {
            if (feature.geometry.type === 'Point') {
                if (feature.properties && feature.properties.name) {
                    let marker = new L.Marker(latlng).addTo(map);
                    marker.bindPopup(feature.properties.name);
                    return marker;
                };
            };
        }
    })
    setSidebarContent(Busroute_geojson_data.features[0].properties);
    BusrouteLayer.addTo(map);
    map.fitBounds(BusrouteLayer.getBounds()); // 調整地圖視野以適應路線

    //公車地圖繪製
    /* routes.elements.forEach(element => {
        let coords = routes.elements.filter(route_display => route_display.type === "way")
        coords.map(coord => [coord.lat, coord.lon]);
        console.log(coords);
        L.polyline(coords, { color: "blue", weight: 3}).addTo(map);
        console.log("success");
        
    }); */
}

async function setSidebarContent(Busroute_tags) {
    let sidebarContent = document.getElementById("sidebar-content");
    let sidebarTitle = document.getElementById("sidebar-title");
    sidebarTitle.innerHTML = Busroute_tags.name || "公車路線";
    sidebarContent.innerHTML = `${Busroute_tags.network} ${Busroute_tags.operator} ${Busroute_tags.ref}<br /> From: ${Busroute_tags.from} <br /> To: ${Busroute_tags.to}`;   
    sidebar.open('businfo_sidebar');
    console.log("setSidebarContent");
}