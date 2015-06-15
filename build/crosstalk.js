! function (e) {
  function t(r) {
    if (n[r]) return n[r].exports;
    var o = n[r] = {
      exports: {},
      id: r,
      loaded: !1
    };
    return e[r].call(o.exports, o, o.exports, t), o.loaded = !0, o.exports
  }
  var n = {};
  return t.m = e, t.c = n, t.p = "", t(0)
}([function (e, t, n) {
  "use strict";
  n(1), n(2), window.CrossTalk = function (e, t) {
    var n = {},
      r = function (e) {
        for (var t in e) n[t] = e[t]
      };
    r(e);
    var o = new BroadcastChannel(t);
    return Object.defineProperties(n, {
      _broadcastChannel: {
        writable: !1,
        enumerable: !1,
        configurable: !1,
        value: o
      }
    }), Object.observe(n, function () {
      n._broadcastChannel.postMessage({
        type: "update",
        data: n
      })
    }), n._broadcastChannel.postMessage({
      type: "ping"
    }), n._broadcastChannel.onmessage = function (e) {
      switch (e.data.type) {
      case "update":
        r(e.data.data);
        break;
      case "ping":
        n._broadcastChannel.postMessage({
          type: "pong",
          data: n
        });
        break;
      case "pong":
        r(e.data.data)
      }
    }, n
  }
}, function (e, t, n) {
  "use strict";
  ! function (e) {
    function t(t) {
      var r = this;
      t = String(t);
      var o = "$BroadcastChannel$" + t + "$";
      n[o] = n[o] || [], n[o].push(this), this._name = t, this._id = o, this._closed = !1, this._mc = new MessageChannel, this._mc.port1.start(), this._mc.port2.start(), e.addEventListener("storage", function (t) {
        if (t.storageArea === e.localStorage && null !== t.newValue && t.key.substring(0, o.length) === o) {
          var n = JSON.parse(t.newValue);
          r._mc.port2.postMessage(n)
        }
      })
    }
    var n = [];
    t.prototype = Object.defineProperties({
      postMessage: function (t) {
        var r = this;
        if (this._closed) {
          var o = new Error;
          throw o.name = "InvalidStateError", o
        }
        var a = JSON.stringify(t),
          i = this._id + String(Date.now()) + "$" + String(Math.random());
        e.localStorage.setItem(i, a), setTimeout(function () {
          e.localStorage.removeItem(i)
        }, 500), n[this._id].forEach(function (e) {
          e !== r && e._mc.port2.postMessage(JSON.parse(a))
        })
      },
      close: function () {
        if (!this._closed) {
          this._closed = !0, this._mc.port1.close(), this._mc.port2.close();
          var e = n[this._id].indexOf(this);
          n[this._id].splice(e, 1)
        }
      },
      addEventListener: function (e, t) {
        return this._mc.port1.addEventListener.apply(this._mc.port1, arguments)
      },
      removeEventListener: function (e, t) {
        return this._mc.port1.removeEventListener.apply(this._mc.port1, arguments)
      },
      dispatchEvent: function (e) {
        return this._mc.port1.dispatchEvent.apply(this._mc.port1, arguments)
      }
    }, {
      name: {
        get: function () {
          return this._name
        },
        configurable: !0,
        enumerable: !0
      },
      onmessage: {
        get: function () {
          return this._mc.port1.onmessage
        },
        set: function (e) {
          this._mc.port1.onmessage = e
        },
        configurable: !0,
        enumerable: !0
      }
    }), e.BroadcastChannel = e.BroadcastChannel || t
  }(self)
}, function (e, t, n) {
  /*!
   * Object.observe "lite" polyfill - v0.2.4
   * by Massimo Artizzu (MaxArt2501)
   * 
   * https://github.com/MaxArt2501/object-observe
   * 
   * Licensed under the MIT License
   * See LICENSE for details
   */
  Object.observe || function (e, t, n) {
    "use strict";
    var r, o, a = ["add", "update", "delete", "reconfigure", "setPrototype", "preventExtensions"],
      i = t.isArray || function (e) {
        return function (t) {
          return "[object Array]" === e.call(t)
        }
      }(e.prototype.toString),
      s = t.prototype.indexOf ? t.indexOf || function (e, n, r) {
        return t.prototype.indexOf.call(e, n, r)
      } : function (e, t, n) {
        for (var r = n || 0; r < e.length; r++)
          if (e[r] === t) return r;
        return -1
      },
      c = "undefined" != typeof n.Map && Map.prototype.forEach ? function () {
        return new Map
      } : function () {
        var e = [],
          t = [];
        return {
          size: 0,
          has: function (t) {
            return s(e, t) > -1
          },
          get: function (n) {
            return t[s(e, n)]
          },
          set: function (n, r) {
            var o = s(e, n); - 1 === o ? (e.push(n), t.push(r), this.size++) : t[o] = r
          },
          "delete": function (n) {
            var r = s(e, n);
            r > -1 && (e.splice(r, 1), t.splice(r, 1), this.size--)
          },
          forEach: function (n) {
            for (var r = 0; r < e.length; r++) n.call(arguments[1], t[r], e[r], this)
          }
        }
      },
      u = e.getOwnPropertyNames ? function () {
        var t = e.getOwnPropertyNames;
        try {
          arguments.callee
        } catch (n) {
          var r = (t(s).join(" ") + " ").replace(/prototype |length |name /g, "").slice(0, -1).split(" ");
          r.length && (t = function (t) {
            var n = e.getOwnPropertyNames(t);
            if ("function" == typeof t)
              for (var o, a = 0; a < r.length;)(o = s(n, r[a++])) > -1 && n.splice(o, 1);
            return n
          })
        }
        return t
      }() : function (t) {
        var n, r, o = [];
        if ("hasOwnProperty" in t)
          for (n in t) t.hasOwnProperty(n) && o.push(n);
        else {
          r = e.hasOwnProperty;
          for (n in t) r.call(t, n) && o.push(n)
        }
        return i(t) && o.push("length"), o
      },
      f = n.requestAnimationFrame || n.webkitRequestAnimationFrame || function () {
        var e = +new Date,
          t = e;
        return function (n) {
          return setTimeout(function () {
            n((t = +new Date) - e)
          }, 17)
        }
      }(),
      p = function (e, t, n) {
        var o = r.get(e);
        o ? b(e, o, t, n) : (o = l(e), b(e, o, t, n), 1 === r.size && f(d))
      },
      l = function (e, t) {
        for (var n = u(e), o = [], a = 0, t = {
            handlers: c(),
            properties: n,
            values: o,
            notifier: v(e, t)
          }; a < n.length;) o[a] = e[n[a++]];
        return r.set(e, t), t
      },
      h = function (e, t, n) {
        if (e.handlers.size) {
          var r, o, a, i, c, f, p, l = e.values,
            h = 0;
          for (r = e.properties.slice(), o = r.length, a = u(t); h < a.length;) c = a[h++], i = s(r, c), f = t[c], -1 === i ? (y(t, e, {
            name: c,
            type: "add",
            object: t
          }, n), e.properties.push(c), l.push(f)) : (p = l[i], r[i] = null, o--, (p === f ? 0 === p && 1 / p !== 1 / f : p === p || f === f) && (y(t, e, {
            name: c,
            type: "update",
            object: t,
            oldValue: p
          }, n), e.values[i] = f));
          for (h = r.length; o && h--;) null !== r[h] && (y(t, e, {
            name: r[h],
            type: "delete",
            object: t,
            oldValue: l[h]
          }, n), e.properties.splice(h, 1), e.values.splice(h, 1), o--)
        }
      },
      d = function () {
        r.size && (r.forEach(h), o.forEach(g), f(d))
      },
      g = function (e, t) {
        e.changeRecords.length && (t(e.changeRecords), e.changeRecords = [])
      },
      v = function (e, t) {
        return arguments.length < 2 && (t = r.get(e)), t && t.notifier || {
          notify: function (t) {
            t.type;
            var n = r.get(e);
            if (n) {
              var o, a = {
                object: e
              };
              for (o in t) "object" !== o && (a[o] = t[o]);
              y(e, n, a)
            }
          },
          performChange: function (t, n) {
            if ("string" != typeof t) throw new TypeError("Invalid non-string changeType");
            if ("function" != typeof n) throw new TypeError("Cannot perform non-function");
            var o, a, i = r.get(e),
              s = n.call(arguments[2]);
            if (i && h(i, e, t), i && s && "object" == typeof s) {
              a = {
                object: e,
                type: t
              };
              for (o in s) "object" !== o && "type" !== o && (a[o] = s[o]);
              y(e, i, a)
            }
          }
        }
      },
      b = function (e, t, n, r) {
        var a = o.get(n);
        a || o.set(n, a = {
          observed: c(),
          changeRecords: []
        }), a.observed.set(e, {
          acceptList: r.slice(),
          data: t
        }), t.handlers.set(n, a)
      },
      y = function (e, t, n, r) {
        t.handlers.forEach(function (t) {
          var o = t.observed.get(e).acceptList;
          ("string" != typeof r || -1 === s(o, r)) && s(o, n.type) > -1 && t.changeRecords.push(n)
        })
      };
    r = c(), o = c(), e.observe = function (t, n, r) {
      if (!t || "object" != typeof t && "function" != typeof t) throw new TypeError("Object.observe cannot observe non-object");
      if ("function" != typeof n) throw new TypeError("Object.observe cannot deliver to non-function");
      if (e.isFrozen && e.isFrozen(n)) throw new TypeError("Object.observe cannot deliver to a frozen function object");
      if ("undefined" == typeof r) r = a;
      else if (!r || "object" != typeof r) throw new TypeError("Third argument to Object.observe must be an array of strings.");
      return p(t, n, r), t
    }, e.unobserve = function (e, t) {
      if (null === e || "object" != typeof e && "function" != typeof e) throw new TypeError("Object.unobserve cannot unobserve non-object");
      if ("function" != typeof t) throw new TypeError("Object.unobserve cannot deliver to non-function");
      var n, a = o.get(t);
      return a && (n = a.observed.get(e)) && (a.observed.forEach(function (e, t) {
        h(e.data, t)
      }), f(function () {
        g(a, t)
      }), 1 === a.observed.size && a.observed.has(e) ? o["delete"](t) : a.observed["delete"](e), 1 === n.data.handlers.size ? r["delete"](e) : n.data.handlers["delete"](t)), e
    }, e.getNotifier = function (t) {
      if (null === t || "object" != typeof t && "function" != typeof t) throw new TypeError("Object.getNotifier cannot getNotifier non-object");
      return e.isFrozen && e.isFrozen(t) ? null : v(t)
    }, e.deliverChangeRecords = function (e) {
      if ("function" != typeof e) throw new TypeError("Object.deliverChangeRecords cannot deliver to non-function");
      var t = o.get(e);
      t && (t.observed.forEach(function (e, t) {
        h(e.data, t)
      }), g(t, e))
    }
  }(Object, Array, this)
}]);