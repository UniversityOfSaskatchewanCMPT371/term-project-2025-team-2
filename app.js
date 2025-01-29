

// Register the service worker - For PWA install
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch((error) => {
                console.log('Service Worker registration failed:', error);
                //logMessage('error', 'Service Worker registration failed');
            });
    });
}

// Handle install button visibility
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

// Listen for the 'beforeinstallprompt' event (Chrome only)
window.addEventListener('beforeinstallprompt', (event) => {
    // For Chrome, prevent the default prompt
    event.preventDefault();
    
    // Store the event for later
    deferredPrompt = event;
    
    // Show the custom install button
    installBtn.style.display = 'block';

    // Handle the install button click
    installBtn.addEventListener('click', () => {
        // Show the install prompt
        deferredPrompt.prompt();
        
        // Handle the user's response
        deferredPrompt.userChoice
            .then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('Install prompt accepted');
                } else {
                    console.log('Install prompt dismissed');
                }
                deferredPrompt = null; // Reset deferred prompt after user choice
            });
    });
});

//Removed event to not trigger linter errors
window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    logMessage('info', 'PWA was installed');
    installBtn.style.display = 'none'; // Hide install button after installation
});
