async function search_place(place) {
    let query = place;
    let url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1`;

    
    try {
        console.log("api send...");
        let response = await fetch(url);
        console.log(url);
        console.log("api process...");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        data.sort((a, b) => b.importance - a.importance);
        console.log(data);
        console.log(data[0]);
        console.log(data[1].lon);
        console.log(data[1].lat);
        let osrm_url = `http://router.project-osrm.org/route/v1/driving/${data[1].lon},${data[1].lat};121.5430669,25.0251452`;
        let osrm_data = await fetch(osrm_url)
        console.log(osrm_url);
        return osrm_data;
    } catch (error) {
        console.error("Nominatim API 請求失敗:", error);
        return null;
    }
    
    
}