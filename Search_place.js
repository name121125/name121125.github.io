async function searchPlace(place) {
    try {
        // Validate input
        const query = validateSearchInput(place);
        
        // Show loading state
        showLoadingState();
        
        // Build URL with additional parameters
        const url = new URL('https://nominatim.openstreetmap.org/search');
        url.searchParams.set('q', query);
        url.searchParams.set('format', 'geojson');
        url.searchParams.set('addressdetails', '1');
        url.searchParams.set('limit', '10'); // Limit results
        
        console.log("API request starting...");
        const response = await fetch(url.toString(), {
            headers: {
                'User-Agent': 'MapApp/1.0 (https://github.com/name121125/name121125.github.io)' // Be respectful to the API
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("API response:", data);
        
        showSuggestions(data.features);
        return data;
        
    } catch (error) {
        console.error("Search failed:", error);
        showErrorMessage(error.message || "Search failed. Please try again.");
        return null;
    }
}

// Function to handle search input
function showSuggestions(results) {
    const dropdown = document.getElementById("suggestionsDropdown");
    dropdown.innerHTML = " "; // 清空舊的建議
    results.forEach(result => {
        const item = document.createElement("div");
        item.classList.add("dropdown-item");  // 或你自定義的 class
        item.textContent = result;
        item.onclick = () => {
            document.querySelector("#search input").value = result;
            dropdown.style.display = "none";
        };
        dropdown.appendChild(item);
    });
    dropdown.style.display = "block"; // 顯示 dropdown
}

// Function to handle search input
function displayResults(data) {
    const resultList = document.getElementById("resultsList");
    resultList.innerHTML = ''; // Clear previous results
    
    if (!data || !data.features || data.features.length === 0) {
        showNoResultsMessage();
        return;
    }
    
    data.features.forEach((feature) => {
        const listItem = createResultItem(feature);
        resultList.appendChild(listItem);
    });
}

function createResultItem(feature) {
    const li = document.createElement("li");
    li.className = "result-item"; // Add CSS class for styling
    
    const name = feature.properties.display_name || "Unknown location";
    const coordinates = feature.geometry.coordinates;
    
    li.innerHTML = `
        <div class="result-name">${escapeHtml(name)}</div>
        <div class="result-coords">Lat: ${coordinates[1]}, Lng: ${coordinates[0]}</div>
    `;
    
    li.addEventListener('click', () => handleResultClick(feature));
    
    return li;
}
function showErrorMessage(message) {
    const resultList = document.getElementById("suggestionsDropdown");
    resultList.innerHTML = `<li class="error-message">${message}</li>`;
}

function showNoResultsMessage() {
    const resultList = document.getElementById("suggestionsDropdown");
    resultList.innerHTML = '<li class="no-results">No results found</li>';
}

function showLoadingState() {
    const resultList = document.getElementById("suggestionsDropdown");
    resultList.innerHTML = '<li class="loading">Searching...</li>';
}

// Debounce function to limit API calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Validate search input
function validateSearchInput(place) {
    if (!place || typeof place !== 'string') {
        throw new Error('Invalid search input');
    }
    
    const trimmed = place.trim();
    if (trimmed.length < 2) {
        throw new Error('Search query too short');
    }
    
    return trimmed;
}

// Helper function to escape HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Handle result item clicks
function handleResultClick(feature) {
    const name = feature.properties.display_name;
    const coordinates = feature.geometry.coordinates;
    
    console.log("Selected location:", {
        name: name,
        lat: coordinates[1],
        lng: coordinates[0]
    });
    
    // Add your logic here (e.g., show on map, fill form, etc.)
}

// Create debounced version for real-time search
const debouncedSearch = debounce(searchPlace, 300);