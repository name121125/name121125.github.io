
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

async function routeDisplay() {
    //公車地圖繪製
    routes.elements.forEach(element => {
        let coords = routes.elements.filter(route_display => route_display.type === "way")
        coords.map(coord => [coord.lat, coord.lon]);
        console.log(coords);
        L.polyline(coords, { color: "blue", weight: 3}).addTo(map);
        console.log("success");
        
    });
}
