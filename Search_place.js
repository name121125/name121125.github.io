async function search_place(place) {
    let query = place;
    let url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1`;

    
    try {
        console.log("api send...");
        let response = await fetch(url);
        console.log("api process...");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let data = await response.json();
        console.log(data.lat, data.lon);
        return data;
    } catch (error) {
        console.error("Nominatim API 請求失敗:", error);
        return null;
    }
    
    
}