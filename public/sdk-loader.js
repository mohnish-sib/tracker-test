"use strict";
let saJsBasePath = "https://sibautomation.com/sa.js?key=";
let swJsBasePath = "https://sibautomation.com/sw.js?key=";
//let basePathStaging = "https://app-automation-staging.51b.dev/sa.js?key=";
// needs to maintain two different files for staging and production with the respective base path

(function () {
    let findKey = function (arr) {
        if (Array.isArray(arr)) {
            for (const element of arr) {
                if (
                    Array.isArray(element) &&
                    element[0] === "init" &&
                    typeof element[1] === "object" &&
                    typeof element[1].client_key === "string"
                ) {
                    return element[1].client_key;
                }
            }
        }
    };

    let injectScript = function (clientKey) {
        // same id as legacy ID to avoid double loading
        let scriptID = "sendinblue-js";
        if (self.document) {
            //window context
            if (document.getElementById(scriptID)) {
                console.warn("Brevo script already loaded");
                return;
            }
            let url = saJsBasePath + clientKey;
            let firstScript = document.getElementsByTagName("script")[0];
            let script = document.createElement("script");
            script.type = "text/javascript";
            script.id = scriptID;
            script.async = true;
            script.src = url;
            if (firstScript && firstScript.parentNode) {
                firstScript.parentNode.insertBefore(script, firstScript);
            } else {
                (document.head || document.body).prepend(script);
            }
        } else if (self.ServiceWorkerGlobalScope && self.importScripts) {
            // Todo Service Worker context
            // eslint-disable-next-line no-undef
            importScripts(swJsBasePath + clientKey);
        }
    };

    let loadSDK = function () {
        let key = findKey(window.Brevo);
        if (key) {
            injectScript(key);
            return;
        }
        window.Brevo = window.Brevo || [];
        if (Array.isArray(window.Brevo)) {
            let originalPush = window.Brevo.push;
            window.Brevo.push = function () {
                originalPush.apply(window.Brevo, arguments);
                let key = findKey(Array.from(arguments));
                if (key) {
                    injectScript(key);
                    window.Brevo.push = originalPush;
                }
            };
        }
    };
    loadSDK();
})();
