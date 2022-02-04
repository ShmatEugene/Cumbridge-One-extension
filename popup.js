let button = document.getElementById('button');
const updateSpan = document.getElementById('updated');
const addedSpan = document.getElementById('added');
const lastUpdate = document.getElementById('lastUpdate');

button.addEventListener('click', function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { toDo: 'updateRecords' });
  });
});

chrome.storage.sync.get('recordsUpdatedCount', ({ recordsUpdatedCount }) => {
  console.log(recordsUpdatedCount);
  updateSpan.innerHTML = ' ' + recordsUpdatedCount;
});

chrome.storage.sync.get('recordsAddedCount', ({ recordsAddedCount }) => {
  console.log(recordsAddedCount);
  addedSpan.innerHTML = ' ' + recordsAddedCount;
});

chrome.storage.sync.get('updateTime', ({ updateTime }) => {
  console.log(updateTime);
  lastUpdate.innerHTML = ' ' + updateTime;
});
