var sidebar = L.control.sidebar({
    autopan: true, 
    closeButton: true,
    container: 'sidebar',
    position: 'left',
}).addTo(map); // 側邊欄

//側邊欄內容
var panelContent = {
    id: 'businfo_sidebar', 
    tab: '<i>info</i>', 
    title: '<div id="sidebar-title">公車資訊</div>', 
    pane: '<div id="sidebar-content">請在地圖上選取一個公車站</div>',
    position: 'top', 
};

sidebar.addPanel(panelContent);
