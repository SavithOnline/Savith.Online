"use strict";
!(function () {
  var t = this,
    e = window.fathom.q || [],
    m = { siteId: "", trackerUrl: "" },
    n = {
      set: r,
      trackPageview: function e(t) {
        t = t || {};
        if ("doNotTrack" in navigator && "1" === navigator.doNotTrack) return;
        if ("visibilityState" in document && "prerender" === document.visibilityState) return;
        if (null === document.body)
          return void document.addEventListener("DOMContentLoaded", function () {
            e(t);
          });
        var n = window.location;
        if ("" === n.host && navigator.userAgent.indexOf("Electron") < 0) return;
        var r = document.querySelector('link[rel="canonical"][href]');
        if (r) {
          var i = document.createElement("a");
          i.href = r.href;
          n = i;
        }
        var o = t.path || n.pathname + n.search;
        o || (o = "/");
        var a = t.hostname || n.protocol + "//" + n.hostname;
        var s = t.referrer || "";
        document.referrer.indexOf(a) < 0 && (s = document.referrer);
        var c = (function () {
          var e = new Date();
          e.setMinutes(e.getMinutes() - 30);
          var t = (function (e) {
            for(var t = document.cookie ? document.cookie.split("; ") : [], n = 0; n < t.length; n++) {
              var r = t[n].split("=");
              if (decodeURIComponent(r[0]) === e) {
                var i = r.slice(1).join("=");
                return decodeURIComponent(i);
              }
            }
            return "";
          })("_fathom");
          if (!t) return v();
          try {
            t = JSON.parse(t);
          } catch (e) {
            return console.error(e), v();
          }
          t.lastSeen < +e && (t.isNewSession = !0);
          return t;
        })();
        var d = {
          pid: c.previousPageviewId || "",
          p: o,
          h: a,
          r: s,
          u: -1 == c.pagesViewed.indexOf(o) ? 1 : 0,
          nv: c.isNewVisitor ? 1 : 0,
          ns: c.isNewSession ? 1 : 0,
          sid: m.siteId,
        };
        var u = m.trackerUrl || (p = document.getElementById("fathom-script"), p ? p.src.replace("tracker.js", "collect") : "");
        var p;
        var f = document.createElement("img");
        f.setAttribute("alt", "");
        f.setAttribute("aria-hidden", "true");
        f.setAttribute("style", "position:absolute");
        f.src = u + (l = d, "?" + Object.keys(l).map(function (e) {
            return encodeURIComponent(e) + "=" + encodeURIComponent(l[e]);
          }).join("&"));
        var l;
        f.addEventListener("load", function () {
          var e = new Date();
          e.setHours(24);
          e.setMinutes(0);
          e.setSeconds(0);
          -1 == c.pagesViewed.indexOf(o) && c.pagesViewed.push(o);
          c.previousPageviewId = d.id;
          c.isNewVisitor = !1;
          c.isNewSession = !1;
          c.lastSeen = +new Date();
          (function (e, t, n) {
            e = encodeURIComponent(e);
            t = encodeURIComponent(String(t));
            var r = e + "=" + t;
            n.path && (r += ";path=" + n.path);
            n.expires && (r += ";expires=" + n.expires.toUTCString());
            document.cookie = r + ";SameSite=None;Secure";
          })("_fathom", JSON.stringify(c), { expires: e, path: "/" });
          document.body.removeChild(f);
        });
        window.setTimeout(function () {
          f.parentNode && (f.src = "", document.body.removeChild(f));
        }, 1e3);
        document.body.appendChild(f);
      },
      setTrackerUrl: function (e) {
        return r("trackerUrl", e);
      },
    };
  function r(e, t) {
    m[e] = t;
  }
  function v() {
    return {
      isNewVisitor: !0,
      isNewSession: !0,
      pagesViewed: [],
      previousPageviewId: "",
      lastSeen: +new Date(),
    };
  }
  window.fathom = function () {
    var e = [].slice.call(arguments),
      t = e.shift();
    n[t].apply(this, e);
  };
  e.forEach(function (e) {
    return fathom.apply(t, e);
  });
})();