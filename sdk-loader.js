"use strict";
let basePath = "https://mohnish-sib.github.io/tracker-test/";
//let basePathStaging = "https://app-automation-staging.51b.dev/";
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
            if (document.getElementById(scriptID)) {
                console.warn("Brevo script already loaded");
                return;
            }
            let url = basePath + "sa.js?key=" + clientKey;
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
            // eslint-disable-next-line no-undef
            importScripts(basePath + "sw.js?key=" + clientKey);
        }
    };

    let loadSDK = function () {
        let key = findKey(self.Brevo);
        if (key) {
            injectScript(key);
            return;
        }
        self.Brevo = self.Brevo || [];
        if (Array.isArray(self.Brevo)) {
            let originalPush = self.Brevo.push;
            self.Brevo.push = function () {
                originalPush.apply(self.Brevo, arguments);
                let key = findKey(Array.from(arguments));
                if (key) {
                    injectScript(key);
                    self.Brevo.push = originalPush;
                }
            };
        }
    };
    loadSDK();
})();
