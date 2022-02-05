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

function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

chrome.extension.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.toDo == 'sendAjaxData') {
    const ajaxData = JSON.parse(msg.data.replace(/ajaxData = |;/g, ''));
    console.log(ajaxData);

    const oParser = new DOMParser();

    const tasks = Object.keys(ajaxData)
      .sort()
      .map((key) => {
        const oDOM = oParser.parseFromString(
          ajaxData[key]
            .replace(/&amp|&ampamp/g, '&amp;amp;') //<= start with
            .replace(/&lt/g, '&lt;')
            .replace(/&gt/g, '&gt;')
            .replace(/&quot/g, '&quot;'),
          'text/xml',
        );
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
            answers: [],
          });
          console.log(values);
        }

        //check questions types ----------------
        //inlineChoice
        if (oDOM.getElementsByTagName('inlineChoiceInteraction')) {
          const inlineChoiceInteractionCollection =
            oDOM.getElementsByTagName('inlineChoiceInteraction');

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

        //choiceInteraction (radiobutton, checkbox)
        if (oDOM.getElementsByTagName('choiceInteraction')) {
          const choiceInteractionCollection = oDOM.getElementsByTagName('choiceInteraction');

          for (let i = 0; i < choiceInteractionCollection.length; i++) {
            const choiceInteraction = choiceInteractionCollection[i];
            const choiceCollection = choiceInteraction.childNodes;
            const responseID = choiceInteraction.attributes.responseIdentifier.nodeValue;

            let responseIndex = getCorrectResponseByID(responseID, responses);

            let values = [];
            let answers = [];

            if (responseIndex !== null) {
              values = responses[responseIndex].values;
            }

            for (let j = 0; j < choiceCollection.length; j++) {
              const inlineChoice = choiceCollection[j];
              if (
                inlineChoice.attributes.identifier &&
                isCorrectAnswer(inlineChoice.attributes.identifier.nodeValue, values)
              ) {
                answers.push(
                  ++inlineChoice.attributes.identifier.nodeValue.split('_')[1] +
                    ': ' +
                    inlineChoice.innerHTML,
                );
              }
            }

            responses[i].answers = answers;
          }
        }

        //gapMatchInteraction
        if (oDOM.getElementsByTagName('gapMatchInteraction')) {
          const gapMatchInteractionCollection = oDOM.getElementsByTagName('gapMatchInteraction');

          for (let i = 0; i < gapMatchInteractionCollection.length; i++) {
            const gapMatchInteraction = gapMatchInteractionCollection[i];
            const gapTextCollection = gapMatchInteraction.childNodes;
            const responseID = gapMatchInteraction.attributes.responseIdentifier.nodeValue;

            let responseIndex = getCorrectResponseByID(responseID, responses);

            let values = [];
            let answers = [];

            if (responseIndex !== null) {
              values = responses[responseIndex].values.map((value) => value.split(' ')[0]);
            }
            for (let j = 0; j < gapTextCollection.length; j++) {
              const gapText = gapTextCollection[j];
              if (
                gapText.attributes.identifier &&
                isCorrectAnswer(gapText.attributes.identifier.nodeValue, values)
              ) {
                answers.push(gapText.innerHTML);
              } else {
              }
            }

            responses[i].answers = answers;
          }
        }
        //textEntryInteraction
        if (oDOM.getElementsByTagName('textEntryInteraction')) {
          const textEntryInteractionCollection = oDOM.getElementsByTagName('textEntryInteraction');

          for (let i = 0; i < textEntryInteractionCollection.length; i++) {
            const textEntryInteraction = textEntryInteractionCollection[i];
            const gapTextCollection = textEntryInteraction.childNodes;
            const responseID = textEntryInteraction.attributes.responseIdentifier.nodeValue;

            let responseIndex = getCorrectResponseByID(responseID, responses);

            let answers = [];

            if (responseIndex !== null) {
              const filter = /\*\*.*/;
              answers = responses[responseIndex].values
                .filter((value) => !filter.test(value))
                .map((value) =>
                  value
                    .replace(/&ampamp;/g, '&') //<= start with
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '"'),
                );
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

    window.setTimeout(function () {
      const iframe = document.getElementsByTagName('iframe')[0];

      for (let i = 1; i < tasks.length - 1; i++) {
        const task = tasks[i];
        const content = iframe.contentWindow.document.getElementById(`content-${i - 1}`);
        const answersDiv = document.createElement('div');
        answersDiv.className = 'cumbridge-one-extension';
        answersDiv.style.userSelect = 'text';

        task.correctResponses.forEach((response, index) => {
          content.appendChild(document.createElement('hr'));

          let h5 = document.createElement('h5');
          let ul = document.createElement('ul');
          h5.innerText = `Вопрос ${index + 1}`;
          answersDiv.appendChild(h5);
          answersDiv.appendChild(ul);
          response.answers.forEach((answer) => {
            let li = document.createElement('li');
            li.innerText = answer;
            ul.appendChild(li);
          });
        });

        content.appendChild(answersDiv);
      }
    }, 3000);
  }
  return true;
});
