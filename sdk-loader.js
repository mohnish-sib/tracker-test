"use strict";
var basePath = "https://mohnish-sib.github.io/tracker-test/";
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
  let scriptInjected = false;
  let injectScript = function (clientKey) {
    // same id as legacy ID to avoid double loading
    console.log(
      "###SDK",
      clientKey,
      scriptInjected,
      self.document,
      "|",
      self.ServiceWorkerGlobalScope,
      "|",
      self
    );
    if (scriptInjected) return;
    scriptInjected = true;
    let scriptID = "sendinblue-js";
    if (self.document) {
      if (document.getElementById(scriptID)) {
        console.warn("Brevo script already loaded");
        return;
      }
      let url = basePath + "sa.js";
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
  if (typeof window !== "undefined") {
    // Fix me: find a way not to listen a message on top level window
    window.addEventListener("message", function (event) {
        console.log("##=>",event);
        let data = event.data;
        if (!(data instanceof Object)) return;
        if (data.sdk !== "Brevo") return;
        switch (data.type) {
            case "ping":
                if (event.ports && event.ports.length > 0) {
                    event.ports[0].postMessage({ type: "pong" });
                }
                break;
            case "init": {
                let initOptions = data.initOpts;
                if (!initOptions) return;
                let clientKey = initOptions.client_key;
                initOptions.do_not_send_page_view=true;
                window.Brevo = window.Brevo || [];
                window.Brevo.push(["init", initOptions]);
                window.Brevo.push(function () {
                    if (event.ports && event.ports.length > 0) {
                        event.ports[0].postMessage({ type: "ready" });
                    }
                });
                injectScript(clientKey);
                break;
            }
        }
    });
}
  loadSDK();
})();
