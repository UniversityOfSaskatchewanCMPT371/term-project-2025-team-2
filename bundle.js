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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _logger_logger_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./logger/logger.js */ \"./logger/logger.js\");\n\n\n// Register the service worker - For PWA install\nif ('serviceWorker' in navigator) {\n    window.addEventListener('load', () => {\n        navigator.serviceWorker.register('/service-worker.js')\n            .then((registration) => {\n                console.log('Service Worker registered with scope:', registration.scope);\n            })\n            .catch((error) => {\n                console.log('Service Worker registration failed:', error);\n                (0,_logger_logger_js__WEBPACK_IMPORTED_MODULE_0__.logMessage)('error', 'Service Worker registration failed');\n            });\n    });\n}\n\n// Handle install button visibility\nlet deferredPrompt;\nconst installBtn = document.getElementById('installBtn');\n\n// Listen for the 'beforeinstallprompt' event (Chrome only)\nwindow.addEventListener('beforeinstallprompt', (event) => {\n    // For Chrome, prevent the default prompt\n    event.preventDefault();\n    \n    // Store the event for later\n    deferredPrompt = event;\n    \n    // Show the custom install button\n    installBtn.style.display = 'block';\n\n    // Handle the install button click\n    installBtn.addEventListener('click', () => {\n        // Show the install prompt\n        deferredPrompt.prompt();\n        \n        // Handle the user's response\n        deferredPrompt.userChoice\n            .then((choiceResult) => {\n                if (choiceResult.outcome === 'accepted') {\n                    console.log('Install prompt accepted');\n                } else {\n                    console.log('Install prompt dismissed');\n                }\n                deferredPrompt = null; // Reset deferred prompt after user choice\n            });\n    });\n});\n\n//Removed event to not trigger linter errors\nwindow.addEventListener('appinstalled', () => {\n    console.log('PWA was installed');\n    (0,_logger_logger_js__WEBPACK_IMPORTED_MODULE_0__.logMessage)('info', 'PWA was installed');\n    installBtn.style.display = 'none'; // Hide install button after installation\n});\n\n\n//# sourceURL=webpack://cmpt371-team2/./app.js?");

/***/ }),

/***/ "./logger/logger.js":
/*!**************************!*\
  !*** ./logger/logger.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   logMessage: () => (/* binding */ logMessage)\n/* harmony export */ });\n\n// This function logs a message to the database\nfunction logMessage(level, message) {\n\n  fetch('https://us-central1-data-a9e6d.cloudfunctions.net/app/entry', {\n    method: 'POST',\n    headers: {\n      'Content-Type': 'application/json'\n    },\n    body: JSON.stringify({\n        title: level,\n        text: message\n    })\n  })\n  .then(response => response.json())\n  .catch(error => console.error(error));\n\n}\n\n\n\n\n//# sourceURL=webpack://cmpt371-team2/./logger/logger.js?");

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