
var BusrouteLayer = null; // 初始化 BusrouteLayer 變數
const layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);
let busstopMarkers = {};

//使用overpass api抓取公車站點資料
async function fetchBusStops() {
    let bounds = map.getBounds();
    let bbox = `${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}`;
    let query = `[out:json];node["highway"="bus_stop"](${bbox});out;`;
    let url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    let response = await fetch(url);
    let data = await response.json();
    return data.elements;
    
}

// 當用戶移動地圖時更新公車站點
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
    
    
    busStops.forEach(stop => {
        let marker = L.marker([stop.lat, stop.lon], {icon: busIcon, nodeID: stop.id})
            .bindPopup((stop.tags.name || "公車站") + ("<br />路線處理中..."))

            
            // 點擊事件
            .on("click", async function(e) {
                processPassBusRoutes(e.target.options.nodeID, stop.tags.name);
                // marker.setPopupContent(stop.tags.name || "公車站") ;
            });
            busstopMarkers[stop.id] = marker;
        busStops_collect.addLayer(marker);
    });
}

async function processPassBusRoutes(marker_nodeID, stop_name) {
    let clickedNodeID = marker_nodeID;
    let clickedMarker = busstopMarkers[clickedNodeID];
    document.getElementById('sidebar-content').innerHTML = (stop_name || "公車站") + ("<br />路線處理中...<br />") + (`<div class="spinner-border " role="status">
  <span class="visually-hidden">Loading...</span>
</div>`);
    
    let routes = await getBusRoutes(clickedNodeID);
    
    // 偵錯用
    console.log("完整的 Overpass API 回應:", routes);
    console.log("elements 的內容:", routes.elements);
    console.log("elements 的類型:", typeof routes.elements);
    if (!routes || !routes.elements) {
        console.error("API 沒有回傳 elements！請檢查 API 查詢條件或請求方式。");
    } else {
        console.log("API 回傳成功，繼續處理資料...");
    }
    
    

    let routeNames = routes.elements
    .filter(element => element.type === "relation" && element.tags?.name) // 只篩選 relation
    .map(relation => relation.tags?.name || "未知編號");
    console.log(routeNames);
    let PopupContent = (`<br />經過的公車路線: <br /> `); // (stop.tags.name || "公車站") + 
        routeNames.forEach(routeName => {
        PopupContent += (`<a href="javascript:void(0);" onclick="routeDisplay('${routeName}')">${routeName}</a> <br />`);
    });
    clickedMarker.setPopupContent(stop_name || "公車站");
    // marker在sidebar前調整才不會影響autopan
    sidebar.open('businfo_sidebar');
    // 在側邊欄顯示路線資訊
    document.getElementById('sidebar-title').innerHTML = (stop_name || "公車站");
    document.getElementById('sidebar-content').innerHTML = PopupContent;
    
}


let fetchTimeout;

map.on("moveend", () => {
    clearTimeout(fetchTimeout); // 清除上次的計時器
    fetchTimeout = setTimeout(updateBusStops, 500); // 0.5 秒內只執行最後一次
});

updateBusStops();  // 初始化時加載公車站

