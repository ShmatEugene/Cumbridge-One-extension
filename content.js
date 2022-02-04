// const API_URL = 'http://localhost:5000/api';

chrome.runtime.sendMessage({ toDo: 'showPageAction' });

// async function fetchAsync(url, options) {
//   let response = await fetch(url, options);
//   let data = await response.json();
//   return data;
// }

// //Обновление записей
// chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
//   if (request.toDo === 'updateRecords') {
//     try {
//       //Получение даты последней записи и текущей даты
//       const updateDates = await fetchAsync(`${API_URL}/records/getUpdateDates`);

//       //Формирование запроса к исходному API (Выборка по датам вида 'sSearch_7: {"start":"2021-07-13","end":"2021-07-15"}')
//       const sSearch_7__Value = `{"start":"${updateDates.updateFrom}","end":"${updateDates.updateTo}"}`;
//       const iDisplayLength__Value = 1000;
//       const requestToNaitiveAPI = `http://fpm.megaton-net.ru/Requests/IndexData?sEcho=3&iColumns=9&sColumns=%2C%2C%2C%2C%2C%2C%2C%2C&iDisplayStart=0&iDisplayLength=${iDisplayLength__Value}&mDataProp_0=&sSearch_0=&bRegex_0=false&bSearchable_0=true&bSortable_0=false&mDataProp_1=Id&sSearch_1=&bRegex_1=false&bSearchable_1=true&bSortable_1=true&mDataProp_2=Type&sSearch_2=&bRegex_2=false&bSearchable_2=true&bSortable_2=true&mDataProp_3=Status&sSearch_3=&bRegex_3=false&bSearchable_3=true&bSortable_3=true&mDataProp_4=Date&sSearch_4=&bRegex_4=false&bSearchable_4=true&bSortable_4=true&mDataProp_5=Location_FullName&sSearch_5=&bRegex_5=false&bSearchable_5=true&bSortable_5=true&mDataProp_6=Client&sSearch_6=&bRegex_6=false&bSearchable_6=true&bSortable_6=true&mDataProp_7=Created&sSearch_7=${sSearch_7__Value}&bRegex_7=false&bSearchable_7=true&bSortable_7=true&mDataProp_8=RequestClientServices__ClientService_Type_Name__&sSearch_8=&bRegex_8=false&bSearchable_8=true&bSortable_8=false&sSearch=&bRegex=false&iSortCol_0=4&sSortDir_0=desc&iSortingCols=1&view=AllRequests2&_=1626340995972&isUpdatingRecords=1`;

//       const newRecords = await fetchAsync(requestToNaitiveAPI); //{sEcho: Number, iTotalRecords: String, iTotalDisplayRecords: String, aaData: Array}
//       console.log(newRecords);

//       //Запрос на добавление новых записей
//       if (newRecords.aaData && newRecords.aaData.length > 0) {
//         requestOptions = {
//           method: 'POST',
//           body: JSON.stringify(newRecords),
//           headers: { 'Content-Type': 'application/json' },
//         };
//         const response = await fetchAsync(`${API_URL}/records/addNewRecords`, requestOptions);
//         console.log(response);
//         chrome.storage.sync.set({ recordsUpdatedCount: response.recordsUpdatedCount });
//         chrome.storage.sync.set({ recordsAddedCount: response.recordsAddedCount });
//         chrome.storage.sync.set({ updateTime: ' ' + new Date().toLocaleDateString('ru-RU') });
//       }
//     } catch (error) {
//       console.log('Ошибка добавления новых записей: ' + error);
//     }
//   }
// });

// //Исправление отображения дат
// // Выбираем целевой элемент
// var loader = document.getElementById('dt_basic_processing');

// // Конфигурация observer (за какими изменениями наблюдать)
// const observerConfig = {
//   attributes: true,
// };

// // Колбэк-функция при срабатывании мутации
// const callback = function (mutationsList, observer) {
//   for (let mutation of mutationsList) {
//     if (mutation.type === 'attributes') {
//       window.setTimeout(function () {
//         const dateTds = document.querySelectorAll('tbody > tr[role="row"] > td:nth-child(5)');
//         dateTds.forEach((td) => {
//           td.innerHTML = td.innerHTML.slice(0, 10);
//         });
//         const createdTds = document.querySelectorAll('tbody > tr[role="row"] > td:nth-child(8)');
//         createdTds.forEach((td) => {
//           td.innerHTML = td.innerHTML.slice(0, 19).replace(/T/, ' ');
//         });
//       }, 500);
//     }
//   }
// };

// // Создаём экземпляр наблюдателя с указанной функцией колбэка
// const observer = new MutationObserver(callback);

// // Начинаем наблюдение за настроенными изменениями целевого элемента
// observer.observe(loader, observerConfig);
