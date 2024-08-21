/* eslint-disable no-undef */
importScripts("https://cdn.brevo.com/js/sdk-staging-loader.js");
console.log("###Service Worker Loaded");
Brevo.push([
    "init",
    {
        client_key: (location.search.match(/[?&]key=([^&]*)/) || [])[1],
    },
]);
