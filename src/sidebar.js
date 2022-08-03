const showSidebar = () => {
  const template = HtmlService.createTemplateFromFile('index');
  const html = template.evaluate().setTitle('VueApp');
  SpreadsheetApp.getUi().showSidebar(html);
};

export default showSidebar;
