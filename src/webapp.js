const doGet = () => {
  const template = HtmlService.createTemplateFromFile('index');
  const html = template.evaluate().setTitle('VueApp');
  return html;
};

export default doGet;
