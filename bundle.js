/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./app.js":
/*!****************!*\
  !*** ./app.js ***!
  \****************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _logger_logger_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./logger/logger.js */ \"./logger/logger.js\");\n\r\n\r\n// Register the service worker - For PWA install\r\nif ('serviceWorker' in navigator) {\r\n    window.addEventListener('load', () => {\r\n        navigator.serviceWorker.register('/service-worker.js')\r\n            .then((registration) => {\r\n                console.log('Service Worker registered with scope:', registration.scope);\r\n            })\r\n            .catch((error) => {\r\n                console.log('Service Worker registration failed:', error);\r\n                (0,_logger_logger_js__WEBPACK_IMPORTED_MODULE_0__.logMessage)('error', 'Service Worker registration failed');\r\n            });\r\n    });\r\n}\r\n\r\n// Handle install button visibility\r\nlet deferredPrompt;\r\nconst installBtn = document.getElementById('installBtn');\r\n\r\n// Listen for the 'beforeinstallprompt' event (Chrome only)\r\nwindow.addEventListener('beforeinstallprompt', (event) => {\r\n    // For Chrome, prevent the default prompt\r\n    event.preventDefault();\r\n    \r\n    // Store the event for later\r\n    deferredPrompt = event;\r\n    \r\n    // Show the custom install button\r\n    installBtn.style.display = 'block';\r\n\r\n    // Handle the install button click\r\n    installBtn.addEventListener('click', () => {\r\n        // Show the install prompt\r\n        deferredPrompt.prompt();\r\n        \r\n        // Handle the user's response\r\n        deferredPrompt.userChoice\r\n            .then((choiceResult) => {\r\n                if (choiceResult.outcome === 'accepted') {\r\n                    console.log('Install prompt accepted');\r\n                } else {\r\n                    console.log('Install prompt dismissed');\r\n                }\r\n                deferredPrompt = null; // Reset deferred prompt after user choice\r\n            });\r\n    });\r\n});\r\n\r\n//Removed event to not trigger linter errors\r\nwindow.addEventListener('appinstalled', () => {\r\n    console.log('PWA was installed');\r\n    (0,_logger_logger_js__WEBPACK_IMPORTED_MODULE_0__.logMessage)('info', 'PWA was installed');\r\n    installBtn.style.display = 'none'; // Hide install button after installation\r\n});\r\n\n\n//# sourceURL=webpack://cmpt371-team2/./app.js?");

/***/ }),

/***/ "./logger/logger.js":
/*!**************************!*\
  !*** ./logger/logger.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   logMessage: () => (/* binding */ logMessage)\n/* harmony export */ });\n\r\n// This function logs a message to the database\r\nfunction logMessage(level, message) {\r\n\r\n  fetch('https://us-central1-data-a9e6d.cloudfunctions.net/app/entry', {\r\n    method: 'POST',\r\n    headers: {\r\n      'Content-Type': 'application/json'\r\n    },\r\n    body: JSON.stringify({\r\n        title: level,\r\n        text: message\r\n    })\r\n  })\r\n  .then(response => response.json())\r\n  .catch(error => console.error(error));\r\n\r\n}\r\n\r\n\r\n\n\n//# sourceURL=webpack://cmpt371-team2/./logger/logger.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./app.js");
/******/ 	
/******/ })()
;