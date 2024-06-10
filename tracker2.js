window.sib.client_key !== "" &&
  (function () {
    "use strict";
    var config = {
        url: "https://in-automate.brevo.com/p",
        tracker_url: "https://in-automate.brevo.com",
        com_err_msg:
          "Please try again later/ Report this error to Sendinblue Team",
        cookie_exp: 182 * 24,
        if_url:
          "https://sibautomation.com/cm.html?key=" + window.sib.client_key,
        is_secure: "false",
        base_url: "https://in-automate.brevo.com",
        custom_url_parsing: "",
        tracking_enabled: {
          track: "true",
          identify: "true",
          page: "true",
          trackLink: "true",
          viewProduct: "true",
          viewCategory: "true",
          search: "true",
          popup: "true",
        },
        popupWebKey: window.sib.popupWebKey || "",
      },
      Helper = new hl();
    var iframe, cm;
    function q() {
      while (window.sib.equeue.length) {
        (function (obj) {
          for (var k in obj) {
            if (typeof window.sib[k] === "function") {
              setTimeout(function () {
                if (typeof window.sib[k] === "function") {
                  window.sib[k](obj[k][0], obj[k][1], obj[k][2], obj[k][3]);
                }
              }, 200);
            }
          }
        })(window.sib.equeue.shift());
      }
    }
    function mo(t) {
      var to = Object(t);
      for (var i = 1; i < arguments.length; i++) {
        var n = arguments[i];
        if (n != null) {
          for (var k in n) {
            Object.prototype.hasOwnProperty.call(n, k) && (to[k] = n[k]);
          }
        }
      }
      return to;
    }
    function sr(o) {
      var s = [];
      for (var p in o) {
        Object.prototype.hasOwnProperty.call(o, p) &&
          s.push(encodeURIComponent(p) + "=" + encodeURIComponent(o[p]));
      }
      return s.join("&");
    }
    function br(d) {
      var td = {
        key: window.sib.client_key,
        cuid: Helper.cookie.get("sib_cuid"),
        ma_url: window.location.href,
      };
      window.sib.email_id && (td.email_id = window.sib.email_id);
      return mo(td, d);
    }
    function generateReqBody(event_type) {
      var b = {
        event_type,
        ma_url: window.location.href,
        ma_referrer: document.referrer,
      };
      if (window.sib.email_id) b.email_id = window.sib.email_id;
      return b;
    }
    function generateReqHeaders() {
      return {
        "Content-Type": "application/json;charset=UTF-8",
        visitor_id: Helper.cookie.get("sib_cuid"),
        "ma-key": window.sib.client_key,
      };
    }
    function setReqHeaders(req, hdrs) {
      for (var key in hdrs) {
        req.setRequestHeader(key, hdrs[key]);
      }
    }
    function createReq(event_type, url_suffix) {
      var reqBody = generateReqBody(event_type);
      var headers = generateReqHeaders();
      var url = config.tracker_url + url_suffix;
      return {
        reqBody,
        headers,
        url,
      };
    }
    function hl() {}
    function sib() {}
    hl.prototype.cookie = {
      get: function (cn) {
        var name = cn + "=",
          dc = document.cookie,
          ca = dc.split(";");
        for (var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == " ") {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return decodeURIComponent(c.substring(name.length, c.length));
          }
        }
        return "";
      },
      set: function (n, v) {
        var cd = new Date();
        cd.setHours(config.cookie_exp);
        var cookie_value =
          n +
          "=" +
          v +
          ";domain= " +
          window.location.hostname +
          ";expires=" +
          cd.toGMTString() +
          ";path=/";
        if (config.is_secure === "true") {
          cookie_value += ";secure=true";
        }
        document.cookie = cookie_value;
      },
      remove: function (n) {
        document.cookie = n + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      },
    };
    hl.prototype.gen_sib_cuid = function () {
      var d = new Date().getTime();
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
        }
      );
    };
    hl.prototype.closest = function (el, fn) {
      return el && (fn(el) ? el : this.closest(el.parentNode, fn));
    };
    hl.prototype.send = function (d, cb) {
      var u = config.url + "?" + sr(d),
        x = new XMLHttpRequest();
      x.open("GET", u, !0);
      x.send();
      return cb && cb(null);
    };
    hl.prototype.post = function (d, cb) {
      var u = config.url,
        x = new XMLHttpRequest();
      x.open("POST", u, !0);
      x.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      x.send(JSON.stringify(d));
      return cb && cb(null);
    };
    hl.prototype.postReq = function (url, b, h) {
      var u = url,
        x = new XMLHttpRequest();
      x.open("POST", u, !0);
      setReqHeaders(x, h);
      x.send(JSON.stringify(b));
    };
    sib.prototype.track = function (n, d, s, a, cb) {
      if (config.tracking_enabled.track === "false") {
        return cb();
      }
      if (n && n != undefined && n != "") {
        var o = {
          sib_type: "track",
          sib_name: n,
        };
        if (d && typeof d == "object") {
          o.contact = d;
        }
        if (s && typeof s == "object") {
          o.event = s;
        }
        if (a && typeof a == "object") {
          o.actiondata = a;
        }
        o = br(o);
        Helper.post(o, function (err) {
          return cb && cb(err);
        });
      } else {
        return cb && cb("Event name not passed.");
      }
    };
    sib.prototype.identify = function (em, d, cb) {
      if (config.tracking_enabled.identify === "false") {
        return cb();
      }
      if (em != undefined && em != "") {
        var o = {
          sib_type: "identify",
        };
        if (d && typeof d == "object") {
          o.contact = d;
        }
        o = br(o);
        o.email_id = em;
        Helper.post(o, function (err) {
          return cb && cb(err);
        });
      } else {
        return cb && cb("Email not passed");
      }
    };
    sib.prototype.trackLink = function (l, d, cb) {
      if (config.tracking_enabled.trackLink === "false") {
        return cb();
      }
      d = br(d);
      d.sib_type = "trackLink";
      var links = l ? (Array.isArray(l) ? l : [l]) : [];
      for (var i = 0; i < links.length; i++) {
        (function (v, td) {
          if (v) {
            var href = v.getAttribute("href");
            var jsClosest = Helper.closest(v, function (el) {
              return (
                el &&
                typeof el.tagName != "undefined" &&
                el.tagName.toLowerCase() == "a"
              );
            });
            if (jsClosest && href) {
              v.addEventListener("click", function (e) {
                e.preventDefault();
                (td.href = href),
                  (td.linkid = v.getAttribute("id")),
                  (td.sib_name = v.getAttribute("id"));
                Helper.send(td, function (err) {
                  cb && cb(err);
                  v.getAttribute("target") !== "_blank"
                    ? setTimeout(function () {
                        window.location.href = href;
                      }, 1000)
                    : window.open(href);
                });
              });
            }
          }
        })(links[i], d);
      }
    };
    sib.prototype.page = function (n, d, cb) {
      if (config.tracking_enabled.page === "false") {
        return cb();
      }
      d = br(d);
      (d.sib_type = "page"),
        (d.ma_title = d.title || d.ma_title || document.title),
        (d.sib_name = n || d.ma_title),
        (d.ma_referrer = d.referrer || d.ma_referrer || document.referrer),
        (d.ma_path = d.path || d.ma_path || window.location.pathname);
      Helper.send(d, function (err) {
        return cb && cb(err);
      });
    };
    sib.prototype.viewCategory = function (n, cb) {
      if (config.tracking_enabled.viewCategory === "false") {
        return cb();
      }
      var request = createReq("view_category", "/ecommerce/category/view");
      request.reqBody.category_id = n;
      Helper.postReq(
        request.url,
        request.reqBody,
        request.headers,
        function (err) {
          return cb && cb(err);
        }
      );
    };
    sib.prototype.viewProduct = function (n, cb) {
      if (config.tracking_enabled.viewProduct === "false") {
        return cb();
      }
      var request = createReq("view_product", "/ecommerce/product/view");
      request.reqBody.product_id = n;
      Helper.postReq(
        request.url,
        request.reqBody,
        request.headers,
        function (err) {
          return cb && cb(err);
        }
      );
    };
    sib.prototype.search = function (q, u, cb) {
      if (config.tracking_enabled.search === "false") {
        return cb();
      }
      var request = createReq("ecommerce_search", "/ecommerce/search");
      request.reqBody.query = q;
      request.reqBody.url = u;
      Helper.postReq(
        request.url,
        request.reqBody,
        request.headers,
        function (err) {
          return cb && cb(err);
        }
      );
    };
    sib.prototype.popup = function (popFunc) {
      console.log("####pop", popFunc);
      if (Array.isArray(popFunc)) {
        window.WonderPush.push(popFunc);
      } else {
        let funcString = popFunc.toString();
        let modifiedFuncString = funcString.replace(/dummySib/g, "WonderPush");
        let newF = new Function("return " + modifiedFuncString)();
        window.WonderPush.push(newF);
      }
      return;
    };
    window.sib = mo(new sib(), window.sib);
    var cuid;
    var cm_flag = false;
    if (Helper.cookie.get("sib_cuid")) {
      cuid = Helper.cookie.get("sib_cuid");
    } else {
      cuid = Helper.gen_sib_cuid();
      cm_flag = true;
      Helper.cookie.set("sib_cuid", cuid);
    }
    var se = "",
      sc = "";

    function load_cm(c) {
      let contact_email = "",
        parameter = "",
        organization_id = 0,
        contact_id = 0;
      if (window.sib.email_id && window.sib.email_id.length > 3) {
        contact_email = window.sib.email_id;
      } else {
        const urlParams = new URLSearchParams(window.location.search);
        se = urlParams.get("_se");
        sc = urlParams.get("_sc");
        if (se) {
          contact_email = window.atob(se);
          parameter = "_se";
        } else if (sc) {
          var contact_metadata = window.atob(sc).split("#");
          organization_id = parseInt(contact_metadata[0], 10);
          contact_id = parseInt(contact_metadata[1], 10);
          parameter = "_sc";
        }
      }
      if (
        cuid &&
        (contact_email || contact_id) &&
        config.custom_url_parsing == "true"
      ) {
        const payload = {
          visitor_id: cuid,
          email_id: contact_email,
          organization_id,
          contact_id,
          parameter,
        };
        const session_url =
            config.base_url + "/visitor/" + window.sib.client_key,
          x = new XMLHttpRequest();
        x.open("POST", session_url, !0);
        x.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        x.send(JSON.stringify(payload));
        return c && c();
      } else if (
        !config.custom_url_parsing ||
        config.custom_url_parsing == "false"
      ) {
        cm = {
          cuid: cuid,
          cm_flag: cm_flag,
          allow_cookie: Helper.cookie.get("cookieconsent_status"),
        };
        window.sib.email_id && (cm.email_id = window.sib.email_id);
        var i =
          config.if_url.indexOf("#") > 0
            ? config.if_url.indexOf("#")
            : config.if_url.length;
        config.if_url = config.if_url.substr(0, i);
        config.if_url = config.if_url + "#" + sr(cm);
        iframe = document.createElement("iframe");
        (iframe.id = "cm_iframe"),
          (iframe.height = "0"),
          (iframe.width = "0"),
          (iframe.style.display = "none"),
          (iframe.style.visibility = "hidden"),
          (iframe.src = config.if_url + "&i=0");
        document.body.appendChild(iframe);
        if (iframe.readyState) {
          iframe.onreadystatechange = function () {
            if (
              iframe.readyState == "loaded" ||
              iframe.readyState == "complete"
            ) {
              iframe.onreadystatechange = null;
              return c && c();
            }
          };
        } else {
          iframe.onload = function () {
            return c && c();
          };
        }
      } else {
        return c && c();
      }
    }
    load_cm(function () {
      q();
      //   typeof create_chat == "function" && create_chat();
      //   typeof triggerNotifyEngine == "function" && triggerNotifyEngine();
    });

    // const wonderPushUrl =
    //   "https://cdn.by.wonderpush.com/sdk/1.1/wonderpush-loader.min.js";

    function getWebKey() {
      const apiUrl = "http://localhost:3001/brevo";
      const config = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };
      fetch(apiUrl, config)
        .then((response) => response.json())
        .then((data) => {
          console.log("API Response:", data);

          const webKey = data.webKey;
          if (webKey) {
            wonderPushTracker(webKey);
          } else {
            console.error("ID not found in the first API response");
          }
        })
        .catch((error) => console.error("Error API call:", error));
    }

    function loadWonderPushScript() {
      const wonderPushUrl =
        "https://cdn.by.wonderpush.com/sdk/1.1/wonderpush-loader.min.js";
      let script = document.createElement("script");
      script.src = wonderPushUrl;
      script.async = true;
      document.head.appendChild(script);
    }

    function wonderPushTracker(webKey) {
      if (webKey != "") {
        loadWonderPushScript();

        window.WonderPush = window.WonderPush || [];
        const WonderPush = window.WonderPush;
        console.log("#####t1", window?.sendinblue?.wp, "|", WonderPush);
        WonderPush.push([
          "init",
          {
            webKey: webKey,
          },
        ]);

        // const popUpFunctions = window.sendinblue.wp || [];
        // console.log("#####t2", popUpFunctions, "|", WonderPush);
        // popUpFunctions.forEach(function (item) {
        //   if (Array.isArray(item)) {
        //     WonderPush.push(item);
        //   } else {
        //     let funcString = item.toString();
        //     let modifiedFuncString = funcString.replace(
        //       /dummySib/g,
        //       "WonderPush"
        //     );
        //     let newF = new Function("return " + modifiedFuncString)();
        //     WonderPush.push(newF);
        //   }
        // });
        // window.sibpopup = WonderPush;

        console.log(
          "#####t3",
          window.sendinblue.wp,
          "|",
          WonderPush,
          "|",
          window.sibpopup
        );
      }
    }
    getWebKey();
  })();
