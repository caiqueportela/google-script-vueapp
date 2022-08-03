const onOpen = () => {
  SpreadsheetApp.getUi().createMenu('VueApp').addItem('Show Sidebar', 'showSidebar').addToUi();
};

export default onOpen;
