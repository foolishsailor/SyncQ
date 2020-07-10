import { SyncQ } from "./syncQ.js";

const syncQ = SyncQ();

let container = document.getElementById("results");
let queueCount = document.querySelector('[name="queueItems"]');

const element = (data, status) => {
  let element = document.createElement("div"),
    elemClass = "";

  switch (status) {
    case "success":
      elemClass = "queue-results---success";
      break;
    case "fail":
      elemClass = "queue-results---error";
      break;
    default:
      elemClass = "queue-results---message";
  }

  element.classList.add(elemClass);
  element.innerHTML = data;
  container.appendChild(element);
};

const success = (data) => {
  queueCount.value = syncQ.queue.length;
  console.log(JSON.stringify(data, null, 2));
  element(JSON.stringify(data, null, 2), "success");
};

const fail = (data) => {
  queueCount.value = syncQ.queue.length;
  element(data, "fail");
};

const debugData = (data) => {
  console.log("Debug Info", data);
  element(data);
};

const clearQueueItems = (event) => {
  event.preventDefault();
  syncQ.clearAll();
};

const addQueueItems = (event) => {
  event.preventDefault();

  let url = document.querySelector('[name="url"]').value;
  let qty = document.querySelector('[name="qty"]').value;

  queueCount.value = 0;

  let queueItemObj = {
    url: url,
    success: success,
    fail: fail,
    responseType: "json",
    header: true,
    headers: ["content-type"],
    debug: false,
    debugData: debugData,
  };

  while (container.lastChild) {
    container.lastChild.remove();
  }

  for (let i = 0; i < qty; i++) {
    syncQ.add(queueItemObj);
  }
};

document.getElementById("startTest").addEventListener("click", addQueueItems);
document
  .getElementById("clearQueue")
  .addEventListener("click", clearQueueItems);
