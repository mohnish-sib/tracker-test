/* eslint-disable no-undef */
importScripts("https://mohnish-sib.github.io/tracker-test/sdk-loader.js");
Brevo.push([
  "init",
  {
    client_key: (location.search.match(/[?&]key=([^&]*)/) || [])[1],
  },
]);
