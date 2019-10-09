/**
 * @Author JC Durbin
 * @License Licensed under the MIT license
 * <LICENSE-MIT or http://opensource.org/licenses/MIT>
 * This file may not be copied, modified, or distributed
 * except according to those terms.
 *  
 * QueueManager creates an array of async fetch() requests and manages them as a syncronous queue
 * For a situation where you need syncronous reqeusts but still want the yummy goodness of promises
 */

function syncQueue() {
  "use strict";

  var queue = [];
  var active = false;

  /**
   * Add items to the queue
   * @param {object}      item
   *  @param {string}           item.url - The url of the request
   *  @param {function}         item.success - the callback functon on succesful request
   *  @param {function}         item.fail - the callback function on failed request
   *
   *  Optional Params
   *  @param {bool}             [item.retry=false] - Retry item if request fails
   *  @param {'json' | 'text'}  [item.responseType='json'] - how to parse the reponse
   *  @param {integer}          [item.maxRetries=3] - Number of times to retryRetry item if request fails
   *  @param {string}           [item.name] - Name of item.  ALows items to be grouped in queue and removed
   *  @param {bool}             [item.priority] - If true item is added to top of queue   *
   *  @param {object}           [item.data] - The data to be sent   *
   *  @param {bool}             [item.debug] - Send debug data
   *  @param {function}         [item.debugData] - the callback to send debug information
   */

  function add(item) {
    //set defaults
    item.retry = item.retry || false;
    item.responseType = item.responseType || 'json';
    item.maxRetries = 3;


    if (item.priority) {
      queue.unshift(item);
    } else {
      queue.push(item);
    }

    if (item.debug)
      item.debugData(
        `Queue length: ${queue.length} | Item added: ${JSON.stringify(item)}`
      );

    if (!active) execute();
  }

  function remove() {}

  /**
   * Clears all items in queue and stops executing
   */
  function clearAll() {
    active = false;
    queue = [];
  }

  /**
   * Clear all items in queue with name == name
   *
   * @param {string} name - THe name of the item.name to filter and remvoe from queue
   */
  function clearByName(name) {
    queue = queue.filter(function(item) {
      if (item.name) return item.name == name;
    });
  }

  /**
   * Executes the fetch.  If the fetch has retry selected then will retry unti llimit reached.  Returns results to callbacks
   */
  function execute() {
    if (queue.length === 0) {
      active = false;
      return;
    }

    active = true;
    var item = queue.shift();

    fetch(item.url, {})
      .then(function(result) {
        switch (item.responseType) {
          case "json":
            return result.json();
          case "text":
            return result.text();
        }
      })
      .then(function(result) {
        item.success(result);
        execute();
      })
      .catch(function(error) {
        if (item.debug)
          item.debugData(`Error - request failed: ${error} | Item: ${item}`);

        if (!item.retryCount) item.retryCount = 0;

        if (item.retry && item.retryCount < item.maxRetries) {
          item.retryCount++;

          if (item.debug)
            item.debugData(
              `Retry: ${item.retryCount} of ${item.maxRetries} | Item: ${item}`
            );

          add(item);
        } else {
          item.fail(error);

          if (item.debug)
            item.debugData(
              `Max retries reached | Item: ${JSON.stringify(item)}`
            );
        }

        execute();
      });
  }

  return {
    queue: queue,
    add: add,
    remove: remove,
    clearAll: clearAll,
    clearByName: clearByName
  };
}
