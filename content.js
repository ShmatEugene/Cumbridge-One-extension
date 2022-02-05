chrome.runtime.sendMessage({ toDo: 'showPageAction' });

function getCorrectResponseByID(responseID, responses) {
  for (let index = 0; index < responses.length; index++) {
    const correctResponse = responses[index];
    if (correctResponse.responseID == responseID) {
      return index;
    }
  }
  return null;
}

function isCorrectAnswer(answer, correctAnswers) {
  for (let index = 0; index < correctAnswers.length; index++) {
    const correctAnswer = correctAnswers[index];
    if (answer === correctAnswer) {
      return true;
    }
  }
  return false;
}

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
          const responseID = response.attributes.identifier.nodeValue;

          let values = [];

          let valuesCollection = response.childNodes[0].childNodes;

          for (let j = 0; j < valuesCollection.length; j++) {
            const value = valuesCollection[j].innerHTML;
            values.push(value);
          }

          responses.push({
            responseID,
            values,
            answers: []
          });
          console.log(values);
        }

        //check questions types ----------------
        //inlineChoice
        if (oDOM.getElementsByTagName('inlineChoiceInteraction')) {
          const inlineChoiceInteractionCollection = oDOM.getElementsByTagName('inlineChoiceInteraction');
          
          for (let i = 0; i < inlineChoiceInteractionCollection.length; i++) {
            const inlineChoiceInteraction = inlineChoiceInteractionCollection[i];
            const inlineChoiceCollection = inlineChoiceInteraction.childNodes;
            const responseID = inlineChoiceInteraction.attributes.responseIdentifier.nodeValue;

            let responseIndex = getCorrectResponseByID(responseID, responses);

            let values = [];
            let answers = [];

            if (responseIndex !== null) {
              values = responses[responseIndex].values;
            }

            for (let j = 0; j < inlineChoiceCollection.length; j++) {
              const inlineChoice = inlineChoiceCollection[j];
              if (isCorrectAnswer(inlineChoice.attributes.identifier.nodeValue, values)) {
                answers.push(inlineChoice.innerHTML);
              }
            }

            responses[i].answers = answers;
            
          }
        }

        return {
          nameXML: key,
          correctResponses: responses,
        };
      });
    console.log(tasks);
  }
  return true;
});
