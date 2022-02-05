chrome.runtime.sendMessage({ toDo: 'showPageAction' });

chrome.extension.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.toDo == 'sendAjaxData') {
    const ajaxData = JSON.parse(msg.data.replace(/ajaxData = |;/g, ''));
    console.log(ajaxData);

    const oParser = new DOMParser();

    const tasks = Object.keys(ajaxData)
      .sort()
      .map((key) => {
        const oDOM = oParser.parseFromString(ajaxData[key], 'text/xml');
        let responsesCollection = oDOM.getElementsByTagName('responseDeclaration');

        let responses = [];

        for (let i = 0; i < responsesCollection.length; i++) {
          const response = responsesCollection[i];

          let values = [];

          let valuesCollection = response.childNodes[0].childNodes;

          for (let j = 0; j < valuesCollection.length; j++) {
            const value = valuesCollection[j].innerHTML;
            values.push(value);
          }

          responses.push(values);
          console.log(values);
        }

        return {
          nameXML: key,
          answers: responses,
        };
      });
    console.log(tasks);
  }
  return true;
});
