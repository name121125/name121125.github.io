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
    pane: '<div id="sidebar-content">test</div>',
    position: 'top', 
};

sidebar.addPanel(panelContent);
