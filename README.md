# syncQueue
Synchronous queue for asynchronous Fetch() - when you need sequential execution but still want all that async promise goodness.   

## Example

#### Instantiate
```.js
var syncQueue = new syncQueue();
```
#### Create callback functions
```.js
function success(data) {
    console.log("Successful result", data);
}

function fail(data) {
    console.error("Failed result", data);
}
```
#### Add queue item to queue
```.js
var queueItemObj = {
    url: 'http://httpbin.org/get',
    success: success,
    fail: fail
};

syncQueue.add(queueItemObj);            
 ```


