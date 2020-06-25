/**
 * @Author JC Durbin
 * @License Licensed under the MIT license
 * <LICENSE-MIT or http://opensource.org/licenses/MIT>
 * This file may not be copied, modified, or distributed
 * except according to those terms.
 *
 * syncFetch creates an array of async fetch() requests and manages them as a syncronous queue
 * For a situation where you need syncronous reqeusts but still want the yummy goodness of promises
 */

const SyncQ = () => {
  "use strict";

  let queue = [];
  let active = false;

  /**
   * Add items to the queue
   * @param {object}      item
   *  @param {string}           item.url - The url of the request
   *  @param {function}         item.success - the callback functon on succesful request
   *  @param {function}         item.fail - the callback function on failed request
   *
   *  Optional Params
   *  @param {'json' | 'text'}  [item.responseType='json'] - how to parse the reponse
   *  @param {bool}             [item.header=false] - Get headers from request and add to reponse as "header" property
   *  @param {array}            [item.headers = []] - List of strings of headers to look for
   *  @param {bool}             [item.retry=false] - Retry item if request fails
   *  @param {integer}          [item.maxRetries=3] - Number of times to retryRetry item if request fails
   *  @param {string}           [item.name] - Name of item.  ALows items to be grouped in queue and removed
   *  @param {bool}             [item.priority] - If true item is added to top of queue   *
   *  @param {object}           [item.data] - The data to be sent   *
   *  @param {bool}             [item.debug] - Send debug data
   *  @param {function}         [item.debugData] - the callback to send debug information
   */

  const add = (item) => {
    //set defaults
    item.responseType = item.responseType || "json";
    item.maxRetries = item.maxRetries || 3;

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
  };

  const remove = () => {};

  /**
   * Clears all items in queue and stops executing
   */
  const clearAll = () => {
    active = false;
    queue = [];
  };

  /**
   * Clear all items in queue with name == name
   *
   * @param {string} name - THe name of the item.name to filter and remvoe from queue
   */
  const clearByName = (name) => {
    queue = queue.filter(function (item) {
      if (item.name) return item.name == name;
    });
  };

  const handleError = ({ item, err }) => {
    if (item.debug)
      item.debugData(`Error - request failed: ${err} | Item: ${item}`);

    if (!item.retryCount) item.retryCount = 0;

    if (item.retry && item.retryCount < item.maxRetries) {
      item.retryCount++;

      if (item.debug)
        item.debugData(
          `Retry: ${item.retryCount} of ${item.maxRetries} | Item: ${item}`
        );

      add(item);
    } else {
      item.fail(err);

      if (item.debug)
        item.debugData(`Max retries reached | Item: ${JSON.stringify(item)}`);
    }

    execute();
  };

  const handleResponse = async ({ item, response }) => {
    let returnObj = {
      result: response,
    };
    console.log("item", item);
    item.responseType === "json"
      ? (returnObj.content = await response.json())
      : (returnObj.content = await response.text());

    if (item.header) {
      let headers = [];
      item.headers.forEach(async (header) => {
        headers.push({ [header]: await response.headers.get(header) });
      });

      returnObj.headers = headers;
    }

    item.success(returnObj);
    execute();
  };

  /**
   * Executes the fetch.  If the fetch has retry selected then will retry unti llimit reached.  Returns results to callbacks
   */
  const execute = async () => {
    if (queue.length === 0) {
      active = false;
      return;
    }

    active = true;
    let item = queue.shift();

    try {
      const response = await fetch(item.url, {});
      if (!response) throw "Null Return";
      handleResponse({ item, response });
    } catch (err) {
      handleError({ item, err });
    }
  };

  return {
    queue,
    add,
    remove,
    clearAll,
    clearByName,
  };
};
