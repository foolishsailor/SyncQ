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
 ## Options
 Queue object options
 
### Required
| Option | Type | Description  | Default | 
| --- | --- | --- | --- |
| **url** | string | Url of request ||
| **success** | function | Callback function on successful request ||
| **fail** | function | Callback function on failed request ||

### Optional
| Option | Type | Description  | Default | 
| --- | --- | --- | --- |
| **retry** | bool | Retry item if request fails | false |
| **responseType** | string | How to parse the reponse | 'json', 'text' - default = 'json' |
| **maxRetries** | integer | Number of times to retryRetry item if request fails | 3 |
| **name** | integer | Name of queue item.  Allows items to be removed by name | |
| **priority** | bool | If true item is added to top of queue | false |
| **debug** | bool | Turn debug on and sends data to debugData callback | false |
| **debugData** | function | Callback function to receive debug data |  |



