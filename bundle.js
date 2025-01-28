/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./app.js":
/*!****************!*\
  !*** ./app.js ***!
  \****************/
/***/ (() => {

eval("\r\n// Register the service worker - For PWA install\r\nif ('serviceWorker' in navigator) {\r\n    window.addEventListener('load', () => {\r\n        navigator.serviceWorker.register('/service-worker.js')\r\n            .then((registration) => {\r\n                console.log('Service Worker registered with scope:', registration.scope);\r\n            })\r\n            .catch((error) => {\r\n                console.log('Service Worker registration failed:', error);\r\n            });\r\n    });\r\n}\r\n\r\n// Handle install button visibility\r\nlet deferredPrompt;\r\nconst installBtn = document.getElementById('installBtn');\r\n\r\n// Listen for the 'beforeinstallprompt' event (Chrome only)\r\nwindow.addEventListener('beforeinstallprompt', (event) => {\r\n    // For Chrome, prevent the default prompt\r\n    event.preventDefault();\r\n    \r\n    // Store the event for later\r\n    deferredPrompt = event;\r\n    \r\n    // Show the custom install button\r\n    installBtn.style.display = 'block';\r\n\r\n    // Handle the install button click\r\n    installBtn.addEventListener('click', () => {\r\n        // Show the install prompt\r\n        deferredPrompt.prompt();\r\n        \r\n        // Handle the user's response\r\n        deferredPrompt.userChoice\r\n            .then((choiceResult) => {\r\n                if (choiceResult.outcome === 'accepted') {\r\n                    console.log('Install prompt accepted');\r\n                } else {\r\n                    console.log('Install prompt dismissed');\r\n                }\r\n                deferredPrompt = null; // Reset deferred prompt after user choice\r\n            });\r\n    });\r\n});\r\n\r\n//Removed event to not trigger linter errors\r\nwindow.addEventListener('appinstalled', () => {\r\n    console.log('PWA was installed');\r\n    installBtn.style.display = 'none'; // Hide install button after installation\r\n});\r\n\n\n//# sourceURL=webpack://cmpt371-team2/./app.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./app.js"]();
/******/ 	
/******/ })()
;