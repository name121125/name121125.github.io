
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
    return data;// 一開始回傳element導致分析時發生element is undefined錯誤
}


