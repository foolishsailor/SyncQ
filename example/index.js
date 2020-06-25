const syncFetch = syncQ();

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

function success(data) {
  queueCount.value--;
  element(JSON.stringify(data), "success");
}

function fail(data) {
  console.log("test", data);
  queueCount.value--;
  element(data, "fail");
}

function debugData(data) {
  console.log("Debug Info", data);
  element(data);
}

function addQueueItems(event) {
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
    debug: true,
    debugData: debugData,
  };

  while (container.lastChild) {
    container.lastChild.remove();
  }

  for (let i = 0; i < qty; i++) {
    syncFetch.add(queueItemObj);
    queueCount.value++;
  }
}
