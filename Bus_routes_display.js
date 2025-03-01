// 查詢經過路線
async function getBusRoutes(BusNode) {
    let query = `[out:json];
        node(${BusNode});     // 查詢公車站 Node ID
        relation(bn)["route"="bus"];  // 查詢包含該節點的公車路線
        (._;>;);
        out body;`;
    let url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    let response = await fetch(url);
    let data = await response.json();
    return data.elements;
}
// 點擊事件
map.on("click", async function(e) {
    let clickedStop = null;
    let clickedNodeID = null;

    markers.forEach(marker => {
        if (marker.getLatLng().distanceTo(e.latlng) < 2) {
            clickedStop = marker;
            clickedNodeID = marker.options.nodeID;
        }
        alert(clickedNodeID);
    })

    if (clickedStop && clickedNodeID) {
        let routes = await getBusRoutes(clickedNodeID);
        let routeNames = routes.map(route => route.tags.ref || "未知編號").join(", ");

        clickedStop.bindPopup(`經過的公車路線: ${routeNames}`).openPopup();
    }
});