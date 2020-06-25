(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["syncQ"] = factory();
	else
		root["syncQ"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

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

module.exports = () => {
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
   * Executes the fetch.  If the fetch has retry selected then will retry unti limit reached.  Returns results to callbacks
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


/***/ })

/******/ });
});
//# sourceMappingURL=syncQ.js.map