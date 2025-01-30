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

eval("\n\n// Register the service worker - For PWA install\nif ('serviceWorker' in navigator) {\n    window.addEventListener('load', () => {\n        navigator.serviceWorker.register('/service-worker.js')\n            .then((registration) => {\n                console.log('Service Worker registered with scope:', registration.scope);\n            })\n            .catch((error) => {\n                console.log('Service Worker registration failed:', error);\n                //log('error', 'Service Worker registration failed');\n            });\n    });\n}\n\n// Handle install button visibility\nlet deferredPrompt;\nconst installBtn = document.getElementById('installBtn');\n\n// Listen for the 'beforeinstallprompt' event (Chrome only)\nwindow.addEventListener('beforeinstallprompt', (event) => {\n    // For Chrome, prevent the default prompt\n    event.preventDefault();\n    \n    // Store the event for later\n    deferredPrompt = event;\n    \n    // Show the custom install button\n    installBtn.style.display = 'block';\n\n    // Handle the install button click\n    installBtn.addEventListener('click', () => {\n        // Show the install prompt\n        deferredPrompt.prompt();\n        \n        // Handle the user's response\n        deferredPrompt.userChoice\n            .then((choiceResult) => {\n                if (choiceResult.outcome === 'accepted') {\n                    console.log('Install prompt accepted');\n                } else {\n                    console.log('Install prompt dismissed');\n                }\n                deferredPrompt = null; // Reset deferred prompt after user choice\n            });\n    });\n});\n\n//Removed event to not trigger linter errors\nwindow.addEventListener('appinstalled', () => {\n    console.log('PWA was installed');\n    // log('info', 'PWA was installed');\n    installBtn.style.display = 'none'; // Hide install button after installation\n});\n\n\n//# sourceURL=webpack://cmpt371-team2/./app.js?");

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