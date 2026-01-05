// background.js
chrome.runtime.onInstalled.addListener(() => {
    console.log("First 20 Hours Extension Installed");
});

// Listener for Focus Session start (mocked for now)
// In a real app, we'd listen for messages from the web app or check local storage
