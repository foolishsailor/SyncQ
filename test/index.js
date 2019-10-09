var syncQueue = new syncQueue();
var container = document.getElementById('results');

function element(data){    
    var element = document.createElement('div');
    element.innerHTML = data;

    container.appendChild(element);

}

function success(data) {
    console.log("Successful result", data);
    element(data);
}

function fail(data) {
    console.error("Failed result", data);
    element(data);
}

function debugData(data){
    console.log("Debug Info", data);
    element(data);
}
   

    
function addQueueItems(){
    let url = document.querySelector('[name="url"]').value;
    let qty = document.querySelector('[name="qty"]').value;

    var queueItemObj = {
        debug: true,
        responseType: 'text',
        retry:true,
        maxRetries: 3,
        name: 'Default',
        priority: true, 
        url: url,
        data: null,
        success: success,
        fail: fail,        
        debugData: debugData
    };

    while(container.lastChild){
        container.lastChild.remove();
    }

    for (var i = 0; i < qty; i++) {
        syncQueue.add(queueItemObj);            
    }
}

