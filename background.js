
const API_URL = 'http://localhost:5000/api';

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.toDo === 'showPageAction') {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.pageAction.show(tabs[0].id);
    });
  }
});
//https://content.cambridgeone.org/cup1/products/evpel4/23/assets/ext-cup-xapiscoreable/1547448769184/data.js

chrome.webRequest.onCompleted.addListener(
  function (details) {
    console.log(details);
    return {
      redirectUrl: 'https://content.cambridgeone.org/cup1/products/evpel4/23/assets/ext-cup-xapiscoreable/1547448769184/data.js'
    };
  },
  { urls: ['*://content.cambridgeone.org/*/data.js'] },
  ['responseHeaders'],
);

// chrome.webRequest.onBeforeRequest.addListener(
//   function (details) {
//     if (
//       details.url.indexOf('://fpm.megaton-net.ru/Requests/IndexData') != -1 &&
//       details.url.indexOf('isUpdatingRecords=1') === -1
//     ) {
//       console.log(details.url);
//       //Если запрос на поиск по телу
//       if (details.url.indexOf('sSearch=&') === -1) {
//         return {
//           redirectUrl: details.url.replace('sEcho=NaN', 'sEcho=1'),
//         };
//       } else {
//         const urlSearchParams = new URLSearchParams(details.url);
//         const params = Object.fromEntries(urlSearchParams.entries());
//         console.log(params);
//         return {
//           redirectUrl: `${API_URL}/records/getFiltered?client=${params.sSearch_6}&sEcho=${params.sEcho}&iDisplayStart=${params.iDisplayStart}&iDisplayLength=${params.iDisplayLength}&Id=${params.sSearch_1}&Location=${params.sSearch_5}&Type=${params.sSearch_8}&SortBy=${params.iSortCol_0}&SortOrder=${params.sSortDir_0}`,
//         };
//       }
//     }
//     return;
//   },
//   { urls: ['*://fpm.megaton-net.ru/Requests/IndexData*'] },
//   ['blocking'],
// );
