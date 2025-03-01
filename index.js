// 初始化地圖
// const map = L.map('map').setView([25.079696, 121.545240], 17);  // 台北 101 的座標
const MIN_ZOOM_TO_FETCH = 15;
let markers = [];
var busStops_collect = L.layerGroup();

//地圖圖磚定義
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 20, 
    subdomains: 'abc', // 可從多個子網域中下載地圖，以加快地圖下載速度
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap',
});
var voyager = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
});
var Positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
});


var map = L.map('map', {layers: [voyager, busStops_collect]}).setView([25.079696, 121.545240], 17); // 台北 101 的座標 & 新增layers

// 使用 Carto Positron 作為底圖
/* L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map); */

var baseMaps = {
    "Voyager": voyager, 
    "OpenStreetMap": osm, 
    "Positron": Positron
};

var overlayMaps = {
    "Bus stops": busStops_collect
};
const layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);

async function fetchBusStops() {
    let bounds = map.getBounds();
    let bbox = `${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}`;
    let query = `[out:json];node["highway"="bus_stop"](${bbox});out;`;
    let url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    let response = await fetch(url);
    let data = await response.json();
    return data.elements;
}

async function updateBusStops() {
    let zoom = map.getZoom();
   
    if (zoom < MIN_ZOOM_TO_FETCH || map.hasLayer(busStops_collect) == false) {
        busStops_collect.clearLayers();
        return;
    }

    let busStops = await fetchBusStops();
    var busIcon = L.icon({
        iconUrl: 'bus.1014x1024.png', 
        iconSize: [25, 25]
    })
    markers.forEach(markers => map.removeLayer(markers));
    markers = [];
    busStops.forEach(stop => {
        let marker = L.marker([stop.lat, stop.lon], {icon: busIcon, nodeID: stop.id})
            .addTo(map)
            .bindPopup(stop.tags.name || "公車站");
        markers.push(marker);
        busStops_collect.addLayer(marker);
    });
}


let fetchTimeout;

map.on("moveend", () => {
    let zoom = map.getZoom();
   
    if (zoom < MIN_ZOOM_TO_FETCH) {
        busStops_collect.clearLayers();
        return;
    }
    clearTimeout(fetchTimeout); // 清除上次的計時器
    fetchTimeout = setTimeout(updateBusStops, 500); // 0.5 秒內只執行最後一次
});

updateBusStops();  // 初始化時加載公車站
