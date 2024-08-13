/* eslint-disable no-undef */
importScripts("https://mohnish-sib.github.io/tracker-test/sdk-loader.js");
console.log(
  "###Service Worker Loaded",
  (location.search.match(/[?&]key=([^&]*)/) || [])[1]
);
Brevo.push([
  "init",
  {
    client_key: (location.search.match(/[?&]key=([^&]*)/) || [])[1],
  },
]);
