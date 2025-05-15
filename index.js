// 初始化地圖
// const map = L.map('map').setView([25.079696, 121.545240], 17);  // 台北 101 的座標
const MIN_ZOOM_TO_FETCH = 16;
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
var TaiwanMapTiles = L.tileLayer('https://wmts.nlsc.gov.tw/wmts/EMAP/default/GoogleMapsCompatible/{z}/{y}/{x}', {
    attribution: '© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});

var baseMaps = {
    "Voyager": voyager, 
    "OpenStreetMap": osm, 
    "Positron": Positron, 
    "TaiwanMapTiles": TaiwanMapTiles
};

var overlayMaps = {
    "Bus stops": busStops_collect
};

var map = L.map('map', {layers: [voyager, busStops_collect]}).setView([25.079696, 121.545240], 17); // 台北 101 的座標 & 新增layers

// 使用 Carto Positron 作為底圖
/* L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map); */


