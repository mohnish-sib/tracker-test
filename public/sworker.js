/* eslint-disable no-undef */
importScripts("https://cdn.brevo.com/js/sdk-staging-loader.js");
Brevo.push([
    "init",
    {
        client_key: (location.search.match(/[?&]key=([^&]*)/) || [])[1],
    },
]);
