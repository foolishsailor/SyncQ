var syncFetch = new syncFetch();
var container = document.getElementById('results');

function element(data){    
    var element = document.createElement('div');
    element.innerHTML = data;

    container.appendChild(element);

}

function success(data) {
    console.log("Successful result", data);
    element(JSON.stringify(data));
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
        url: url,
        success: success,
        fail: fail,
        responseType: 'json',
        header: true,
        headers: ['content-type'],        
        debug: true,        
        debugData: debugData
    };

    while(container.lastChild){
        container.lastChild.remove();
    }

    for (var i = 0; i < qty; i++) {
        syncFetch.add(queueItemObj);    
     
    }
}

